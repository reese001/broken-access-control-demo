import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


// This middleware has a vulnerability - it doesn't check user roles for admin routes
export function middleware(request: NextRequest) {
 // Check if the request is for an admin route
 if (request.nextUrl.pathname.startsWith('/api/admin')) {
   // VULNERABILITY: No role check implemented
   // Anyone can access admin routes
 }
  // Continue with the request for all routes
 return NextResponse.next();
}


// Configure the middleware to only run on admin API routes
export const config = {
 matcher: '/api/admin/:path*',
};
