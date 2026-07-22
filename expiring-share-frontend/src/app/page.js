'use client';

import { useSession } from 'next-auth/react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

export default function Home() {
  const { data: session, status } = useSession();

  // Loading State
  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-slate-400 text-xs tracking-wider uppercase font-mono">
          Verifying Vault Session Keys...
        </div>
      </div>
    );
  }

  // Unauthenticated - Show Landing Page
  if (!session) {
    return <LandingPage />;
  }

  // Authenticated - Show Dashboard
  return <Dashboard />;
}