'use client';

import { useState, useEffect } from 'react';
import LoginRegisterForm from '@/components/LoginRegisterForm';
import UserDashboard from '@/components/UserDashboard';
import { User } from '@/tools/user.model';

export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // Check for stored user on component mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } catch (err) {
                // Handle invalid stored data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    }, []);

    const handleLogin = (userData: User, authToken: string) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <main className="min-h-screen bg-gray-100 py-10">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8">
                    Broken Access Control Demo
                </h1>
                
                <div className="max-w-5xl mx-auto bg-white rounded-lg shadow overflow-hidden">
                    {user && token ? (
                        <UserDashboard user={user} onLogout={handleLogout} />
                    ) : (
                        <div className="p-6">
                            <LoginRegisterForm onLogin={handleLogin} />
                        </div>
                    )}
                </div>
            
                <div className="mt-8 text-center text-sm text-gray-600">
                    <p>This application demonstrates broken access control vulnerabilities:</p>
                    <ol className="list-decimal list-inside text-left max-w-2xl mx-auto mt-3">
                        <li className="mb-2">
                        <span className="font-bold">Unprotected API Endpoints:</span> API endpoints have no authentication or authorization checks.
                        </li>
                        <li>
                            <span className="font-bold">Login page is not rate limited</span> You can try to login with incorrect credentials without being locked out.
                        </li>
                    </ol>
                </div>
            </div>
        </main>
    );
}
