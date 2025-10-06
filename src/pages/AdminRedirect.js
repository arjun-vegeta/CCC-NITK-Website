import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');

        if (token) {
            // User is logged in, redirect to dashboard
            navigate('/admin/dashboard', { replace: true });
        } else {
            // User is not logged in, redirect to login
            navigate('/admin/login', { replace: true });
        }
    }, [navigate]);

    // Show loading while redirecting
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
            </div>
        </div>
    );
}

export default AdminRedirect;