'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && isAdmin) {
        router.push('/admin');
      } else {
        // Redirect all users (guest and customer) to products page
        router.push('/products');
      }
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  // Simple loading screen while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
