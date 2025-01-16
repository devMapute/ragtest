import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

// Initialize Pinecone client
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || '',
});
const pineconeIndex = pinecone.Index('simple-rag');

// Initialize Google Gemini Embedding Model
const embeddingsModel = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    modelName: 'models/embedding-001', // Specify the embedding model
});

// Initialize Google Generative AI for text generation
const googleGenAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const generationModel = googleGenAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(request: Request) {
    const { query } = await request.json();

    // Step 1: Generate embeddings for the query
    const queryEmbedding = await embeddingsModel.embedQuery(query);
    console.log("Query Embedding:", queryEmbedding); // Log the embedding

    // Step 2: Retrieve relevant data from Pinecone
    try {
        const results = await pineconeIndex.query({
            vector: queryEmbedding,
            topK: 102,
            includeMetadata: true,
        });
        console.log("Pinecone Results:", results); // Log the results

        // Step 3: Generate a response using the retrieved data
        const context = results.matches.map((match, index) => {
            return `[${index}] Location: ${match.metadata?.location}, Type: ${match.metadata?.type}, Report: ${match.metadata?.userReport}`;
        }).join('\n');

        console.log("Context:", context); // Log the context
        const prompt = `Based on the following context, answer the question: ${query}\nContext: ${context}`;

        const response = await generationModel.generateContent(prompt);
        const text = await response.response.text();

        return NextResponse.json({ response: text }, { status: 200 });
    } catch (error) {
        console.error("Error querying Pinecone:", error);
        return NextResponse.json({ error: "Failed to retrieve data from Pinecone." }, { status: 500 });
    }
}