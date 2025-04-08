// MongoDB initialization script for the security demo
// This will create necessary collections in the database

// Switch to the securityDemo database
db = db.getSiblingDB('securityDemo');

// Drop existing collections to start fresh
db.users.drop();
db.sessions.drop();

// Create an admin user
db.users.insertOne({
    id: "admin-user-id-123",
    username: "admin",
    password: "admin123", // In a real app, this would be hashed
    role: "admin",
    email: "admin@example.com"
});

// Create a sample regular user
db.users.insertOne({
    id: "regular-user-id-456",
    username: "user",
    password: "user123", // In a real app, this would be hashed
    role: "user",
    email: "user@example.com"
});

// Create indexes for faster lookups
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ id: 1 }, { unique: true });
db.sessions.createIndex({ token: 1 }, { unique: true });
db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Success message
print("Security Demo database initialized successfully!");
