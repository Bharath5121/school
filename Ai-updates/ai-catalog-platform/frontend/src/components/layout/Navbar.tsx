'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/app.store';
import { useThemeStore } from '../../store/theme.store';

interface NavbarProps {
  onMenuToggle?: () => void;
}

export const Navbar = ({ onMenuToggle }: NavbarProps) => {
  const { user, isAuthenticated, logout } = useAppStore();
  const { theme, toggleTheme } = useThemeStore();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  const dashboardHref = user?.role === 'ADMIN' ? '/admin' : '/feed';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-xl border-b border-transparent dark:border-slate-800/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none transition-colors">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          )}
          <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-white font-extrabold text-[11px] leading-none">AI</span>
          </div>
          <span className="font-display font-bold text-[15px] tracking-tight text-gray-900 dark:text-white">
            Catalog
          </span>
        </Link>
        </div>

        <nav className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/50 transition-colors"
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          {isAuthenticated && user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <span className="text-emerald-400 text-xs font-bold">{initials}</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white hidden sm:block">{user.name}</span>
                <svg className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#111827] border border-gray-100 dark:border-slate-700/50 rounded-xl shadow-xl shadow-slate-900/[0.08] dark:shadow-black/40 py-1.5 animate-in fade-in slide-in-from-top-1">
                  <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-700/40">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>
                    <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {user.role}
                    </span>
                  </div>
                  <Link
                    href={dashboardHref}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    Settings
                  </Link>
                  <div className="border-t border-slate-200 dark:border-slate-700/40 mt-1.5 pt-1.5">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50"
              >
                Sign in
              </Link>
              <Link href="/register">
                <button className="h-9 px-5 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-400 transition-all duration-200 shadow-md shadow-emerald-500/15">
                  Get Started
                </button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
