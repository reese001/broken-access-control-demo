# Broken Access Control Demo

A simple Next.js application that demonstrates two common security vulnerabilities: Role-Based Access Control Bypass and Lack of Rate Limiting.

## Vulnerabilities

This application intentionally contains the following vulnerabilities:

### 1. Role-Based Access Control Bypass

**Description:** The application allows any authenticated user to access admin-only functionality because it only checks for the presence of a valid authentication token but doesn't verify the user's role.

**Vulnerable Endpoints:**
- `GET /api/admin/dashboard` - Should only be accessible to admins but can be accessed by any authenticated user
- `GET /api/users` - Admin-only endpoint that returns all users, but accessible to anyone

**How to Exploit:**
1. Register as a regular user
2. Log in with your regular user account
3. Click the "Access Admin Dashboard" button
4. You'll see sensitive data meant only for admins

### 2. Lack of Rate Limiting

**Description:** The application doesn't implement any form of rate limiting on authentication endpoints, making it vulnerable to brute force attacks.

**Vulnerable Endpoints:**
- `POST /api/auth/login` - No limit on failed login attempts

**How to Exploit:**
1. Use a script or tool to repeatedly attempt logins with different passwords
2. Without rate limiting, attackers can try thousands of password combinations
3. Given enough attempts, weak passwords will eventually be compromised

**Security Impact:**
- Allows brute force attacks against user accounts
- Makes password guessing attacks practical
- Can lead to unauthorized account access

### Installation and How to Run

1. Clone the repository:
   ```bash
   git clone git@github.com:reese001/broken-access-control-demo.git
   cd broken-access-control-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the MongoDB database and app server using Docker:
   ```bash
   docker-compose up --build
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.