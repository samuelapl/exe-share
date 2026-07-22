'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function LandingPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleManualAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (isSignUp) {
      try {
        const res = await fetch('http://localhost:4000/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        if (res.ok) {
          signIn('credentials', { email, password, callbackUrl: '/' });
        } else {
          const data = await res.json();
          alert(data.error || 'Signup failed. Account may already exist.');
        }
      } catch (err) {
        alert('Authentication endpoint unreachable.');
      } finally {
        setIsLoading(false);
      }
    } else {
      signIn('credentials', { email, password, callbackUrl: '/' });
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center py-12">
      {/* Left Section - Hero Content */}
      <div className="space-y-6 text-left">
        <span className="text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full font-medium border border-indigo-500/20 inline-block">
          V2.0 Secure Standard
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
          Stop pasting plain passwords into{' '}
          <span className="text-indigo-400">chat channels</span>.
        </h1>
        <p className="text-slate-400 text-base leading-relaxed">
          Encrypt environment variables, API secrets, and sensitive data tokens 
          into time-capped links that self-destruct instantly on reading. 
          Zero historical logging footprint.
        </p>
        
        {/* Feature Cards */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
  {/* Single-Use - Shield Icon */}
  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center space-x-3 flex-1 group hover:border-emerald-500/50 transition-colors">
    <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors">
      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    </div>
    <div>
      <strong className="text-slate-200 block text-sm">Single-Use</strong>
      <p className="text-xs text-slate-400">Atomic memory drop wiping</p>
    </div>
  </div>

  {/* AES-256-GCM - Lock Icon */}
  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center space-x-3 flex-1 group hover:border-indigo-500/50 transition-colors">
    <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/20 transition-colors">
      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    </div>
    <div>
      <strong className="text-slate-200 block text-sm">AES-256-GCM</strong>
      <p className="text-xs text-slate-400">Military grade encryption</p>
    </div>
  </div>
</div>

        {/* Trust Badges */}
        <div className="flex flex-wrap gap-4 pt-4">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Zero-Trust Protocol</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Auto-Destruct</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>No Logs Stored</span>
          </div>
        </div>
      </div>

      {/* Right Section - Authentication Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl w-full max-w-sm mx-auto">
        <h3 className="text-xl font-bold mb-1 text-center">
          {isSignUp ? 'Create Secured Vault' : 'Sign In Required'}
        </h3>
        <p className="text-xs text-slate-400 text-center mb-6">
          Authenticate to access the encryption framework utility engine.
        </p>
        
        {/* Google Auth */}
        <button 
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full bg-white text-slate-950 font-medium py-2.5 rounded-lg text-sm mb-4 hover:bg-slate-100 transition flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative my-6 text-center">
          <hr className="border-slate-800" />
          <span className="absolute bg-slate-900 px-3 text-xs text-slate-500 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            OR
          </span>
        </div>

        {/* Email/Password Auth */}
        <form onSubmit={handleManualAuth} className="space-y-3">
          <input 
            type="email" 
            placeholder="Vault Email address" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" 
            disabled={isLoading}
          />
          <input 
            type="password" 
            placeholder="Account Security Key" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" 
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <span>{isSignUp ? 'Register Vault' : 'Unlock Dashboard Portal'}</span>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-4">
          {isSignUp ? 'Already registered?' : 'Need a vault environment?'}{' '}
          <button 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-indigo-400 hover:underline font-medium"
            disabled={isLoading}
          >
            {isSignUp ? 'Login Here' : 'Create One Now'}
          </button>
        </p>
      </div>
    </div>
  );
}