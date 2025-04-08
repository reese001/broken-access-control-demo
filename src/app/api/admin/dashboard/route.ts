import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    
    return NextResponse.json({
        message: "Admin dashboard data",
        sensitiveData: "This should only be accessible to users with admin role",
        stats: {
            totalUsers: 10,
            activeUsers: 5,
            pendingRequests: 3
        },
        adminEmails: [
            "admin@example.com",
            "superadmin@example.com"
        ]
    });
} 