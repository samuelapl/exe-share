'use client';

import { useState } from 'react';

export default function SecretForm({ userId, onSecretCreated }) {
  const [content, setContent] = useState('');
  const [expiry, setExpiry] = useState(15);
  const [views, setViews] = useState(1);
  const [generatedLink, setGeneratedLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCreateSecret = async (e) => {
    e.preventDefault();
    
    if (!content || content.trim() === '') {
      alert('Please enter some content to encrypt');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation CreateLink($text: String!, $exp: Int!, $vws: Int!, $uid: ID!) {
              generateSecretLink(plainTextContent: $text, expirationMinutes: $exp, allowedViews: $vws, userId: $uid) {
                urlCode
              }
            }
          `,
          variables: { 
            text: content, 
            exp: parseInt(expiry), 
            vws: parseInt(views), 
            uid: userId 
          }
        })
      });
      
      const { data, errors } = await response.json();
      
      if (errors) {
        throw new Error(errors[0].message);
      }
      
      if (data?.generateSecretLink?.urlCode) {
        const link = `${window.location.origin}/share/${data.generateSecretLink.urlCode}`;
        setGeneratedLink(link);
        if (onSecretCreated) {
          onSecretCreated(); // Refresh audit log
        }
      }
      
    } catch (err) {
      alert('Failed to create secret: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setGeneratedLink('');
    setContent('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
      <h2 className="text-xl font-bold mb-2">Lock a Secret Payload</h2>
      
      {!generatedLink ? (
        <form onSubmit={handleCreateSecret} className="space-y-4">
          <textarea
            className="w-full h-28 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono resize-none text-slate-200 transition"
            placeholder="Paste raw credentials, API string lines, tokens..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={loading}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <select 
              value={expiry} 
              onChange={(e) => setExpiry(e.target.value)} 
              className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition disabled:opacity-50"
              disabled={loading}
            >
              <option value={5}>5 Mins Lifespan</option>
              <option value={15}>15 Mins Lifespan</option>
              <option value={60}>1 Hour Lifespan</option>
              <option value={1440}>24 Hours Lifespan</option>
            </select>
            
            <select 
              value={views} 
              onChange={(e) => setViews(e.target.value)} 
              className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition disabled:opacity-50"
              disabled={loading}
            >
              <option value={1}>1 View Only (Self-Destruct)</option>
              <option value={5}>5 Views Allowed</option>
              <option value={10}>10 Views Allowed</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 py-3 rounded-lg text-sm font-medium transition shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Encrypting Matrix...</span>
              </>
            ) : (
              <span>Generate Encrypted Link</span>
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-lg p-4 text-xs text-emerald-400 flex items-center space-x-2">
            <span>🔒</span>
            <span>Content successfully locked and encrypted inside memory.</span>
          </div>
          
          <div className="flex space-x-2">
            <input 
              type="text" 
              readOnly 
              value={generatedLink} 
              className="flex-grow bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs font-mono text-indigo-400 select-all focus:outline-none" 
            />
            <button 
              onClick={copyToClipboard} 
              className="bg-slate-800 hover:bg-slate-700 px-4 rounded-lg text-xs font-medium min-w-[75px] transition"
            >
              {copied ? '✅ Copied!' : 'Copy'}
            </button>
          </div>
          
          <button 
            onClick={resetForm} 
            className="w-full border border-slate-800 text-xs py-2 rounded-lg text-slate-400 hover:bg-slate-800 transition"
          >
            Create Next Secret Token
          </button>
        </div>
      )}
    </div>
  );
}