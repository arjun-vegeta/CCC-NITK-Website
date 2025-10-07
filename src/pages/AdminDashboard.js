import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileText, BookOpen, LogOut, RefreshCw, Image, Users, Home } from 'lucide-react';

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');

    if (!token) {
      navigate('/admin/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage('');
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/mdx/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sync failed');
      }

      setSyncMessage(`✅ ${data.message}`);
      setTimeout(() => setSyncMessage(''), 5000);
    } catch (err) {
      setSyncMessage(`❌ Error: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {user?.username}
              </span>
              <button
                onClick={handleSync}
                disabled={syncing}
                className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Files'}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sync Message */}
        {syncMessage && (
          <div className={`mb-6 p-4 rounded-lg ${syncMessage.startsWith('✅')
            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}>
            {syncMessage}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Network Guides */}
          <Link
            to="/admin/content/guides"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Network Guides
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Manage network guides and documentation
            </p>
          </Link>

          {/* Facilities */}
          <Link
            to="/admin/content/facilities"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <FileText className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Facilities
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Manage facilities content and information
            </p>
          </Link>



          {/* Image Manager */}
          <Link
            to="/admin/images"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Image className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              MDX Image Manager
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Upload and manage images for content
            </p>
          </Link>

          {/* People Manager */}
          <Link
            to="/admin/people"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <Users className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              People Manager
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Manage staff and team members
            </p>
          </Link>

          {/* Homepage Manager */}
          <Link
            to="/admin/homepage"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Home className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Homepage Manager
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Update homepage sections and content
            </p>
          </Link>

          {/* Homepage Image Manager */}
          <Link
            to="/admin/homepage-images"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Image className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Homepage Images
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Manage images for hero, stats, facilities & guides
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
