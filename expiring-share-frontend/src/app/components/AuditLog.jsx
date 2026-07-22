"use client";

import { useState } from "react";

export default function AuditLog({ logs, isLoading, onPanicWipe }) {
  const [panicking, setPanicking] = useState({});

  const handlePanic = async (code) => {
    setPanicking((prev) => ({ ...prev, [code]: true }));
    await onPanicWipe(code);
    setPanicking((prev) => ({ ...prev, [code]: false }));
  };

  if (isLoading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
        <h3 className="text-lg font-bold mb-1">Live Security Audit Log</h3>
        <p className="text-xs text-slate-400 mb-4">Loading audit data...</p>
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold">Security Activity Log</h3>
          <p className="text-xs text-slate-400">
            See all your active links and delete any secret instantly.
          </p>
        </div>
        <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">
          {logs.length} active
        </span>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
          <div className="text-4xl mb-2">🔐</div>
          <p className="text-center py-6 text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
            No active secrets found. Create your first secret link now.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-2 px-2">Tracking ID</th>
                <th className="py-2 px-2">Views Stamped</th>
                <th className="py-2 px-2">Security Status</th>
                <th className="py-2 px-2 text-right">Emergency Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-950/30 transition">
                  <td className="py-3 px-2 font-mono text-indigo-400 font-medium">
                    {log.urlCode}
                  </td>
                  <td className="py-3 px-2 text-slate-300 font-mono">
                    {log.viewCount} / {log.maxViews}
                  </td>
                  <td className="py-3 px-2">
                    {log.isDestroyed ? (
                      <span className="bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded text-[10px] font-medium border border-rose-500/20 flex items-center space-x-1 w-fit">
                        <span>💥</span>
                        <span>Exploded</span>
                      </span>
                    ) : (
                      <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-medium border border-emerald-500/20 flex items-center space-x-1 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Active</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right">
                    {!log.isDestroyed ? (
                      <button
                        onClick={() => handlePanic(log.urlCode)}
                        disabled={panicking[log.urlCode]}
                        className="bg-rose-950/40 border border-rose-900 text-rose-400 hover:bg-rose-600 hover:text-white px-2.5 py-1 rounded text-[10px] font-medium transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 ml-auto"
                      >
                        {panicking[log.urlCode] ? (
                          <>
                            <svg
                              className="animate-spin h-3 w-3"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span>Deactivating...</span>
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                           <span>Deactivate</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-slate-600 text-[10px] pr-2 font-mono">
                        Purge Complete
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
