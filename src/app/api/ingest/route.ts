import { NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

import { Pinecone } from '@pinecone-database/pinecone';

// Initialize MongoDB client
const uri = process.env.MONGODB_URI || "";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const database = client.db('sample_rag');
const collection = database.collection('user_inputs');

// Initialize Pinecone client
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || '',
});
const pineconeIndex = pinecone.Index('simple-rag');

// Initialize Google Gemini Embeddings Model
const embeddingsModel = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    modelName: 'models/embedding-001',
});

export async function POST(request: Request) {
    try {
        await client.connect()
        // Step 1: Retrieve data from MongoDB
        const data = await collection.find({}).toArray();

        // Step 2: Embed data
        const embeddings = await Promise.all(data.map(async (item) => {
            const embedding = await embeddingsModel.embedQuery(item.userReport);
            return {
                _id: item._id.toString(),
                type: item.type,
                userReport: item.userReport,
                location: item.location,
                embedding: embedding, // Store the embedding
            };
        }));

        // Step 3: Store embeddings in Pinecone
        const pineconeData = embeddings.map((item) => ({
            id: item._id, // Use a unique ID for each item, using the _id from MongoDB
            values: item.embedding,
            metadata: {
                type: item.type,
                userReport: item.userReport,
                location: item.location,
            },
        }));

        await pineconeIndex.upsert(pineconeData);

        return NextResponse.json({ message: 'Data ingested and embedded successfully!' }, { status: 200 });
    } catch (error: any) {
        console.error("Error during data ingestion and embedding:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    finally {
        await client.close();
    }
}