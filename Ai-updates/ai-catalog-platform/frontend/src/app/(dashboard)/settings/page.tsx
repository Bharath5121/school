'use client';
import { useAuth } from '../../../hooks/useAuth';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 p-8 shadow-lg">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-60" />
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <span className="text-2xl">⚙️</span>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Profile & Settings</h1>
            <p className="text-slate-200 text-sm mt-0.5">Manage your account details</p>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl bg-white dark:bg-[#111827] border border-gray-100 dark:border-slate-700/40 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700/40">
          <h2 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wide">Account Information</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              <span className="text-xl text-white font-bold">
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-base font-bold text-gray-900 dark:text-white">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 dark:text-slate-500">{user?.email || 'No email set'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/30 border border-gray-100 dark:border-slate-700/30">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-600 mb-1">Name</h3>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name || 'User'}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/30 border border-gray-100 dark:border-slate-700/30">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-600 mb-1">Email</h3>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.email || 'N/A'}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/30 border border-gray-100 dark:border-slate-700/30">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-600 mb-1">Role</h3>
              <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{user?.role?.toLowerCase() || 'Student'}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/30 border border-gray-100 dark:border-slate-700/30">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-600 mb-1">Field of Interest</h3>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.gradeLevel || 'None set'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Card */}
      <div className="rounded-2xl bg-white dark:bg-[#111827] border border-gray-100 dark:border-slate-700/40 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700/40">
          <h2 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wide">Preferences</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800/30 border border-gray-100 dark:border-slate-700/30">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Theme</p>
              <p className="text-xs text-gray-500 dark:text-slate-500 mt-0.5">Toggle between light and dark mode using the sun/moon icon in the top navigation bar.</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm shrink-0">
              <span className="text-white text-sm">🌓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
