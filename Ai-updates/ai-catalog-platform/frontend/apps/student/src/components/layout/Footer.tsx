'use client';
import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-10 border-t border-gray-100 dark:border-slate-800/50 bg-white/50 dark:bg-transparent shadow-[0_-1px_3px_0_rgba(15,23,42,0.02)] dark:shadow-none">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center">
              <span className="text-white font-extrabold text-[8px]">AI</span>
            </div>
            <span className="font-display font-bold text-sm tracking-tight text-slate-600 dark:text-slate-500">Catalog</span>
          </Link>

          <div className="flex items-center gap-8 text-sm text-slate-600 dark:text-slate-500">
            <Link href="#" className="hover:text-slate-300 transition-colors">About</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">Contact</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">Privacy</Link>
          </div>

          <p className="text-sm text-slate-600">
            &copy; {currentYear} AI Catalog
          </p>
        </div>
      </div>
    </footer>
  );
};
