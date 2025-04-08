export interface User {
    id: string;
    username: string;
    password: string; // In a real app, this would be hashed
    role: 'admin' | 'user';
    email: string;
}

export interface Session {
    userId: string;
    token: string;
    expiresAt: Date;
} 