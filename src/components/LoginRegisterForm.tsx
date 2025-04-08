'use client';

import { useState } from 'react';
import { User } from '@/tools/user.model';
import { sendJSONData } from '@/tools/Toolkit';

interface LoginRegisterFormProps {
    onLogin: (user: User, token: string) => void;
}

export default function LoginRegisterForm({ onLogin }: LoginRegisterFormProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                const data = await sendJSONData(
                    '/api/auth/login',
                    { username, password }
                );
                
                if (!data || data.message === 'Invalid credentials') {
                    throw new Error(data ? data.message : 'Login failed');
                }
                
                onLogin(data.user, data.token);
            } else {
                const data = await sendJSONData(
                    '/api/users',
                    { username, password, email, role }
                );
                
                if (!data || data.message !== 'User registered successfully') {
                    throw new Error(data ? data.message : 'Registration failed');
                }
                
                // Switch to login form after successful registration
                setIsLogin(true);
                setError('Registration successful! Please log in.');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">
                {isLogin ? 'Login' : 'Register'}
            </h2>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="username">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                
                {!isLogin && (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="role">
                                Role
                            </label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            <p className="text-sm text-gray-600 mt-1">
                                VULNERABILITY: This dropdown allows anyone to register as an admin
                            </p>
                        </div>
                    </>
                )}
                
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
                </button>
            </form>
            
            <div className="mt-4 text-center">
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-blue-500 hover:underline"
                >
                    {isLogin ? 'Register' : 'Login'}
                </button>
            </div>
        </div>
    );
} 