'use client';
import { useState } from 'react';
import { useAuthController } from '../controllers/auth.controller';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, error, loading } = useAuthController();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin({ email, password });
  };

  return (
    <div className="bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-slate-700/40 rounded-2xl p-8">
      <h2 className="text-xl font-bold mb-6 text-center text-gray-900 dark:text-white">Welcome Back</h2>
      {error && <div className="text-red-400 text-sm mb-4 text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"
            className="flex h-10 w-full rounded-lg border border-slate-200 dark:border-slate-700/40 bg-white dark:bg-[#0B0F19] px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-slate-600 transition-all focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20" />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
            className="flex h-10 w-full rounded-lg border border-slate-200 dark:border-slate-700/40 bg-white dark:bg-[#0B0F19] px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-slate-600 transition-all focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20" />
        </div>
        <button type="submit" className="w-full h-10 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/15 disabled:opacity-50" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};
