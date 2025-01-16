import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// Initialize MongoDB client
const mongoClient = new MongoClient(process.env.MONGODB_URI || '');
await mongoClient.connect();
const db = mongoClient.db('sample_rag'); // Ensure this matches your database name
const collection = db.collection('user_inputs'); // Ensure this matches your collection name

export async function POST(request: Request) {
    const { type, userReport, location } = await request.json();

    // Save user input to MongoDB
    await collection.insertOne({ type, userReport, location, createdAt: new Date() });

    return NextResponse.json({ message: 'Input submitted successfully!' }, { status: 200 });
} 