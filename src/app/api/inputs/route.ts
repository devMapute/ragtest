import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// Initialize MongoDB client
const mongoClient = new MongoClient(process.env.MONGODB_URI || '');
await mongoClient.connect();
const db = mongoClient.db('sample_rag'); // Replace with your database name
const collection = db.collection('user_inputs');

export async function GET() {
    const inputs = await collection.find({}).toArray();
    return NextResponse.json(inputs);
} 