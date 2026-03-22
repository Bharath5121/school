'use client';
import { useAppStore } from '@/store/app.store';
import { useTheme } from '@/components/ThemeProvider';
import { Sun, Moon, LogOut } from 'lucide-react';

export const AdminNavbar = () => {
  const { user, logout } = useAppStore();
  const { theme, toggle } = useTheme();

  return (
    <header className="h-14 border-b border-gray-200 dark:border-white/5 bg-white dark:bg-[#0B0F19] flex items-center justify-between px-6">
      <h1 className="text-sm font-semibold text-gray-800 dark:text-white">AI Catalog Admin</h1>
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <span className="text-xs text-gray-500 dark:text-white/50">{user?.name} ({user?.role})</span>
        <button
          onClick={() => logout()}
          className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-white/50 hover:text-red-500 dark:hover:text-red-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </header>
  );
};
