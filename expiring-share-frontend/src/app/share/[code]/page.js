'use client';

import Link from 'next/link';
import { use, useState, useEffect } from 'react';

export default function SharePage({ params: paramsPromise }) {
  // Unwrap parameters using the standard modern React layout hooks hook pattern
  const params = use(paramsPromise);
  const code = params.code;

  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSecret = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              query Reveal($c: String!) {
                revealSecret(urlCode: $c) {
                  decryptedContent
                }
              }
            `,
            variables: { c: code }
          })
        });

        const { data, errors } = await response.json();

        if (errors) {
          setError(errors[0].message);
        } else {
          setSecret(data.revealSecret.decryptedContent);
        }
      } catch (err) {
        setError('Network pipeline block occurred trying to fetch this code row.');
      } finally {
        setLoading(false);
      }
    };

    fetchSecret();
  }, [code]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
      {loading && (
        <div className="text-center py-8 text-sm text-slate-400 animate-pulse">
          Contacting database and triggering real-time decryption loops...
        </div>
      )}

      {error && (
        <div className="text-center py-6 space-y-4">
          <div className="text-4xl">💥</div>
          <h3 className="text-xl font-semibold text-rose-400">Link Destroyed or Expired</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            The data tracking row for this link does not exist. It has hit its maximum view threshold or its scheduled expiration lifespan clock.
          </p>
          <Link href="/" className="inline-block bg-slate-800 hover:bg-slate-700 text-xs px-4 py-2 rounded-lg transition mt-2">
            Go Create a New Link
          </Link>
        </div>
      )}

      {secret && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-amber-950/30 border border-amber-800/50 rounded-lg p-4 text-xs text-amber-400">
            ⚠️ Warning: This link has just reached its read counter threshold or was set to single-use. If you refresh or close this browser screen wrapper pane window, **the data is gone forever.**
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Decrypted Cleartext Output</label>
            <div className="relative">
              <pre className="w-full min-h-24 bg-slate-950 border border-slate-800 rounded-lg p-4 text-sm font-mono text-slate-200 overflow-x-auto whitespace-pre-wrap">
                {secret}
              </pre>
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded text-xs transition"
              >
                {copied ? 'Copied! ✅' : 'Copy Content'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
