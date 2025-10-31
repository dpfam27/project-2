'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function UserWidget() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        User Info
      </h3>
      
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
          <p className="text-base font-medium text-gray-900 dark:text-white">
            {user?.username}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            {user?.role}
          </span>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
          <p className="text-base font-mono text-gray-900 dark:text-white">
            #{user?.userId}
          </p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
