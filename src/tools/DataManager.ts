import {
    MongoClient,
    Document
} from "mongodb";
import { User, Session } from "./user.model";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

const MONGO_URL: string = "mongodb://mongo:27017";
const MONGO_DB_NAME: string = "securityDemo";
const MONGO_COLLECTION_USERS: string = "users";
const MONGO_COLLECTION_SESSIONS: string = "sessions";

// User Management Functions

export async function registerUser(request: NextRequest) {
    const mongoClient = new MongoClient(MONGO_URL);

    try {
        await mongoClient.connect();
        const body = await request.json();
        
        // VULNERABILITY 1: Role-Based Access Control Bypass
        // User can specify any role during registration
        const newUser: User = {
            id: uuidv4(),
            username: body.username,
            password: body.password, // VULNERABILITY: Password not hashed
            role: body.role || 'user', // User can specify any role, including 'admin'
            email: body.email
        };

        const existingUser = await mongoClient
            .db(MONGO_DB_NAME)
            .collection(MONGO_COLLECTION_USERS)
            .findOne({ username: newUser.username });

        if (existingUser) {
            return NextResponse.json(
                { message: "Username already exists" },
                { status: 409 }
            );
        }

        const result = await mongoClient
            .db(MONGO_DB_NAME)
            .collection(MONGO_COLLECTION_USERS)
            .insertOne(newUser as unknown as Document);

        if (result.acknowledged) {
            // Don't return the password in response
            const { password, ...userWithoutPassword } = newUser;
            return NextResponse.json(
                { message: "User registered successfully", user: userWithoutPassword },
                { status: 201 }
            );
        }

        return NextResponse.json(
            { message: "Failed to register user" },
            { status: 500 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await mongoClient.close();
    }
}

export async function loginUser(request: NextRequest) {
    const mongoClient = new MongoClient(MONGO_URL);

    try {
        await mongoClient.connect();
        const body = await request.json();
        
        const user = await mongoClient
            .db(MONGO_DB_NAME)
            .collection(MONGO_COLLECTION_USERS)
            .findOne({ username: body.username });

        if (!user) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        if (user.password !== body.password) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Generate session token
        const token = uuidv4();
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

        const session: Session = {
            userId: user.id,
            token,
            expiresAt
        };

        await mongoClient
            .db(MONGO_DB_NAME)
            .collection(MONGO_COLLECTION_SESSIONS)
            .insertOne(session as unknown as Document);

        return NextResponse.json(
            { 
                message: "Login successful", 
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    email: user.email
                }
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await mongoClient.close();
    }
}

export async function getAllUsers(request: NextRequest) {
    const mongoClient = new MongoClient(MONGO_URL);

    try {
        await mongoClient.connect();
        
        // VULNERABILITY 1 (continued): Role-Based Access Control Bypass
        // This endpoint should only be accessible to admins,
        // but there's no role check - any authenticated user can access it
        
        // Only check if a token exists in the request, but not the role
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { message: "Authentication required" },
                { status: 401 }
            );
        }
        
        const users = await mongoClient
            .db(MONGO_DB_NAME)
            .collection(MONGO_COLLECTION_USERS)
            .find({})
            .project({ password: 0 }) // At least don't return passwords
            .toArray();

        return NextResponse.json(
            { users },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await mongoClient.close();
    }
}

export async function getUserProfile(request: NextRequest, id: string) {
    const mongoClient = new MongoClient(MONGO_URL);

    try {
        await mongoClient.connect();
        
        // VULNERABILITY 2: Horizontal Privilege Escalation
        // This endpoint doesn't verify that the requesting user is accessing their own profile
        // Any authenticated user can access any profile by knowing the ID
        
        // Only checks if a token exists, but doesn't verify it belongs to the requested user
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { message: "Authentication required" },
                { status: 401 }
            );
        }
        
        const user = await mongoClient
            .db(MONGO_DB_NAME)
            .collection(MONGO_COLLECTION_USERS)
            .findOne({ id }, { projection: { password: 0 } });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { user },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await mongoClient.close();
    }
}

// Helper function to validate a token (checks if it exists in sessions collection)
export async function validateToken(token: string): Promise<{valid: boolean, userId?: string, role?: string}> {
    const mongoClient = new MongoClient(MONGO_URL);
    
    try {
        await mongoClient.connect();
        
        const session = await mongoClient
            .db(MONGO_DB_NAME)
            .collection(MONGO_COLLECTION_SESSIONS)
            .findOne({ token, expiresAt: { $gt: new Date() } });
        
        if (!session) {
            return { valid: false };
        }
        
        const user = await mongoClient
            .db(MONGO_DB_NAME)
            .collection(MONGO_COLLECTION_USERS)
            .findOne({ id: session.userId });
            
        if (!user) {
            return { valid: false };
        }
        
        return { 
            valid: true, 
            userId: user.id,
            role: user.role
        };
    } catch (error) {
        console.error('Token validation error:', error);
        return { valid: false };
    } finally {
        await mongoClient.close();
    }
}
