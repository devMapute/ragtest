import { NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';

// Initialize MongoDB client
const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const database = client.db('sample_rag');
const collection = database.collection('user_inputs');

export async function GET() {
    try {
        await client.connect();

        // Aggregate reports by location
        const reports = await collection.aggregate([
            {
                $group: {
                    _id: "$location", // Group by location
                    count: { $sum: 1 } // Count the number of reports for each location
                }
            }
        ]).toArray();

        return NextResponse.json(reports, { status: 200 });
    } catch (error) {
        console.error("Error fetching reports:", error);
        return NextResponse.json({ error: "Failed to fetch reports." }, { status: 500 });
    } finally {
        await client.close();
    }
} 