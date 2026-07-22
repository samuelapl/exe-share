'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl w-full mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 group">
            {/* Icon SVG */}
            <div className="relative">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
                <svg 
                  className="w-5 h-5 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 11V7a3 3 0 00-6 0v4"
                  />
                </svg>
              </div>
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-indigo-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            <div className="flex flex-col">
              <span className="font-bold tracking-wider text-lg text-white">
                EXPIRING_SHARE
              </span>
              <span className="text-[10px] text-slate-400 tracking-widest -mt-0.5">
                SECURE DEAD-DROP
              </span>
            </div>
          </Link>

          {/* Right Section - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <div className="flex items-center space-x-3 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs text-slate-300 font-mono">
                    {session.user.email}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-xs bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 px-4 py-2 rounded-lg border border-rose-900/50 transition-all duration-200 font-medium hover:shadow-lg hover:shadow-rose-900/20"
                >
                  <span className="flex items-center space-x-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Lock Workspace</span>
                  </span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="text-xs text-slate-400">Secure Protocol</span>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                <span className="text-xs text-indigo-400 font-mono">v2.0</span>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-800 space-y-3">
            {session ? (
              <>
                <div className="flex items-center space-x-3 bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-800">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs text-slate-300 font-mono truncate">
                    {session.user.email}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="w-full text-xs bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 px-4 py-2.5 rounded-lg border border-rose-900/50 transition-all duration-200 font-medium"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Lock Workspace</span>
                  </span>
                </button>
              </>
            ) : (
              <div className="text-center text-xs text-slate-400 py-2">
                Secure Protocol v2.0
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}