'use client';

import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import SecretForm from './SecretForm';
import AuditLog from './AuditLog';

export default function Dashboard() {
  const { data: session } = useSession();
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Audit Logs
  const fetchUserLogs = async () => {
    if (!session?.user?.id) return;
    setIsLoading(true);
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query GetLogs($uid: ID!) {
              getUserLogs(userId: $uid) {
                id
                urlCode
                maxViews
                viewCount
                expiresAt
                isDestroyed
              }
            }
          `,
          variables: { uid: session.user.id }
        })
      });
      const { data } = await response.json();
      if (data?.getUserLogs) setLogs(data.getUserLogs);
    } catch (err) {
      console.error('Failed to sync logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const loadLogs = async () => {
      if (!session?.user?.id || !mounted) return;
      await fetchUserLogs();
    };
    
    loadLogs();
    
    return () => {
      mounted = false;
    };
  }, [session]);

  // Panic wipe handler
  const handlePanicButton = async (code) => {
    if (!code || code.trim() === '') {
      alert('Invalid secret code');
      return;
    }
    
    if (!confirm('⚠️ Are you sure you want to completely obliterate this secret payload node right now? This action cannot be undone!')) {
      return;
    }
    
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation PanicWipe($urlCode: String!) {
              revokeSecret(urlCode: $urlCode)
            }
          `,
          variables: { urlCode: code }
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.errors) {
        console.error('GraphQL Errors:', result.errors);
        alert('Failed to wipe secret: ' + result.errors[0].message);
        return;
      }
      
      if (result.data && result.data.revokeSecret === true) {
        alert('✅ Secret successfully destroyed!');
        await fetchUserLogs();
      } else {
        alert('❌ Failed to destroy secret. Please try again.');
      }
      
    } catch (err) {
      console.error('Panic wipe error:', err);
      alert('Network error: ' + err.message);
    }
  };

  // Refresh logs (passed to SecretForm)
  const refreshLogs = async () => {
    await fetchUserLogs();
  };

  return (
    <div className="w-full max-w-3xl space-y-8 my-12">
   

      {/* Secret Creation Form */}
      <SecretForm 
        userId={session.user.id} 
        onSecretCreated={refreshLogs}
      />

      {/* Audit Log Dashboard */}
      <AuditLog 
        logs={logs} 
        isLoading={isLoading}
        onPanicWipe={handlePanicButton}
      />
    </div>
  );
}