'use client';

import { useState } from 'react';
import { User } from '@/tools/user.model';
import { getJSONData } from '@/tools/Toolkit';

interface UserDashboardProps {
    user: User;
    onLogout: () => void;
}

export default function UserDashboard({ user, onLogout }: UserDashboardProps) {
    const [adminData, setAdminData] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Demonstrate direct API access vulnerability - Admin endpoint
    const accessAdminAPI = async () => {
        try {
            setError(null);
            setSuccessMessage(null);
            setUserData(null);
            
            const headers = {
                'user-role': user.role
            };
            
            const data = await getJSONData('/api/admin/dashboard', 0, true, headers);
            
            setAdminData(data);
            setSuccessMessage(user.role === 'admin' 
                ? 'Successfully accessed admin data as admin!' 
                : 'You accessed admin data, but this should be restricted to admins only!');
        } catch (err: any) {
            setError('Failed to access admin data: ' + err.message);
            console.error(err);
        }
    };

    // Demonstrate direct API access vulnerability - Users endpoint
    const accessUsersAPI = async () => {
        try {
            setError(null);
            setSuccessMessage(null);
            setAdminData(null);
            
            // VULNERABILITY: Direct access to API without proper authorization
            // No token is even needed to access this endpoint
            const data = await getJSONData('/api/users', 0, true);
            
            setUserData(data);
            setSuccessMessage('Successfully accessed all user data without authorization!');
        } catch (err: any) {
            setError('Failed to access user data: ' + err.message);
            console.error(err);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Welcome, {user.username}</h2>
                    <p className="text-gray-600">Role: {user.role}</p>
                </div>
                <button 
                    onClick={onLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {successMessage}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4 bg-white shadow">
                    <h3 className="text-xl font-semibold mb-4">Vulnerability #1: Admin API</h3>
                    <p className="mb-4 text-gray-700">
                        This demo shows how anyone can access admin data directly through an unprotected API endpoint.
                        No authentication check is performed on the server.
                    </p>

                    <button
                        onClick={accessAdminAPI}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                    >
                        Access Admin API Directly
                    </button>

                    {adminData && (
                        <div className="mt-4 p-3 bg-gray-100 rounded">
                            <h4 className="font-semibold">Admin API Data (Should be protected):</h4>
                            <pre className="mt-2 text-sm overflow-auto max-h-40">
                                {JSON.stringify(adminData, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>

                <div className="border rounded-lg p-4 bg-white shadow">
                    <h3 className="text-xl font-semibold mb-4">Vulnerability #2: Users API</h3>
                    <p className="mb-4 text-gray-700">
                        This demo shows how anyone can access all users&apos; data (including passwords!) directly through an unprotected API endpoint.
                        No authentication check is performed on the server.
                    </p>

                    <button
                        onClick={accessUsersAPI}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                    >
                        Access Users API Directly
                    </button>

                    {userData && (
                        <div className="mt-4 p-3 bg-gray-100 rounded">
                            <h4 className="font-semibold">User API Data (Should be protected):</h4>
                            <pre className="mt-2 text-sm overflow-auto max-h-40">
                                {JSON.stringify(userData, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 