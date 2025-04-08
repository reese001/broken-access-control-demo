import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/tools/DataManager";
import { MongoClient } from "mongodb";

const MONGO_URL: string = "mongodb://mongo:27017";
const MONGO_DB_NAME: string = "securityDemo";
const MONGO_COLLECTION_USERS: string = "users";

// API endpoint for user registration
export async function POST(request: NextRequest) {
    return registerUser(request);
}

// VULNERABILITY: Unprotected API endpoint for fetching all users
// This endpoint should require authentication and proper authorization
export async function GET() {
    const mongoClient = new MongoClient(MONGO_URL);

    try {
        await mongoClient.connect();
        
        // No authentication check at all
        // Anyone can fetch all users including their sensitive data
        
        const users = await mongoClient
            .db(MONGO_DB_NAME)
            .collection(MONGO_COLLECTION_USERS)
            .find({})
            .toArray();

        return NextResponse.json(
            { 
                message: "This endpoint is completely unprotected!",
                users 
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await mongoClient.close();
    }
} 