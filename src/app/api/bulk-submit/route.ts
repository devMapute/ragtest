import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// Initialize MongoDB client
const mongoClient = new MongoClient(process.env.MONGODB_URI || '');
await mongoClient.connect();
const db = mongoClient.db('sample_rag'); // Ensure this matches your database name
const collection = db.collection('user_inputs'); // Ensure this matches your collection name

export async function POST(request: Request) {
    const inputs = await request.json(); // Expecting an array of objects

    // Validate input
    if (!Array.isArray(inputs)) {
        return NextResponse.json({ error: 'Invalid input format' }, { status: 400 });
    }

    // Insert bulk data into MongoDB
    const result = await collection.insertMany(inputs.map(input => ({
        type: input.type,
        userReport: input.userReport,
        location: input.location,
        createdAt: new Date(),
    })));

    return NextResponse.json({ message: `${result.insertedCount} records inserted successfully!` }, { status: 200 });
} 