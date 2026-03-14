'use client';
import { useAppStore } from '@/store/app.store';
import { useDashboard } from '../../hooks/useDashboard';

interface AdminData {
  platformHealth: string;
  usersCount: number;
  activeToday: number;
  contentUpdates: Array<{ id: string; title: string; date: string; author: string }>;
}

export const AdminDashboard = () => {
  const { user } = useAppStore();
  const { data, loading, error } = useDashboard<AdminData>('admin');

  if (loading) return <div className="text-white/20 animate-pulse">Loading system dashboard...</div>;
  if (error) return <div className="text-red-500/50 italic font-medium tracking-widest uppercase text-xs">Error: {error}</div>;

  return (
    <div className="space-y-8 animate-in ms-in duration-700">
      <header>
        <h1 className="text-3xl font-bold font-heading">Admin Console 🔧</h1>
        <p className="text-black/50 dark:text-white/50 mt-2">Control the entire platform&apos;s content and systems.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-white/5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-white/10 backdrop-blur-sm">
          <div className="text-3xl font-bold text-primary">{data?.platformHealth}</div>
          <p className="text-xs text-black/40 dark:text-white/40 uppercase font-bold tracking-widest mt-1">Platform Health Status</p>
          <button className="mt-4 text-primary text-xs font-medium hover:underline">Monitor Health →</button>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-white/5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-white/10 backdrop-blur-sm">
          <div className="text-3xl font-bold text-primary">{data?.usersCount.toLocaleString()}</div>
          <p className="text-xs text-black/40 dark:text-white/40 uppercase font-bold tracking-widest mt-1">Total Registered Users</p>
          <button className="mt-4 text-primary text-xs font-medium hover:underline">Manage Users →</button>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-white/5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-white/10 backdrop-blur-sm">
           <div className="text-3xl font-bold text-primary">{data?.activeToday}</div>
           <p className="text-xs text-black/40 dark:text-white/40 uppercase font-bold tracking-widest mt-1">Daily Active Users</p>
           <button className="mt-4 text-primary text-xs font-medium hover:underline">Review All Analytics →</button>
        </div>
      </div>

      <section className="bg-white dark:bg-white/5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none rounded-3xl p-8 border border-gray-100 dark:border-white/10 overflow-x-auto">
        <h2 className="text-xl font-bold mb-6 font-heading text-primary">Content Sync Logs</h2>
        <div className="space-y-4">
          {data?.contentUpdates.map((update, i) => (
            <div key={i} className="flex items-center justify-between text-sm py-3 border-b border-slate-100 dark:border-white/[0.03]">
              <span className="text-white/50 w-24 text-xs font-bold uppercase">{update.date}</span>
              <span className="text-gray-900 dark:text-white font-medium flex-1">{update.title}</span>
              <span className="text-black/40 dark:text-white/40 italic flex-1 text-right">{update.author}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 font-heading text-primary">Admin Toolkit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 rounded-xl bg-white dark:bg-white/5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 font-bold uppercase tracking-widest text-xs">Trigger Aggregator</button>
          <button className="p-4 rounded-xl bg-white dark:bg-white/5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 font-bold uppercase tracking-widest text-xs">Reset All Caches</button>
          <button className="p-4 rounded-xl bg-white dark:bg-white/5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 font-bold uppercase tracking-widest text-xs">Create Content Manually</button>
          <button className="p-4 rounded-xl bg-white dark:bg-white/5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 font-bold uppercase tracking-widest text-xs">School Management</button>
        </div>
      </section>
    </div>
  );
};
