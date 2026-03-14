'use client';
import { useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/store/app.store';
import { SidebarItem } from './SidebarItem';
import {
  STUDENT_NAV,
  PARENT_NAV,
  TEACHER_NAV,
  ADMIN_NAV,
  COMMON_ACCOUNT_NAV,
  NavSectionType
} from './nav-config';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar = ({ open, onClose }: SidebarProps) => {
  const { user } = useAppStore();
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  const navSections = useMemo((): NavSectionType[] => {
    if (!user) return [];
    switch (user.role) {
      case 'STUDENT': return STUDENT_NAV;
      case 'PARENT': return PARENT_NAV;
      case 'TEACHER': return TEACHER_NAV;
      case 'ADMIN': return ADMIN_NAV;
      default: return [];
    }
  }, [user]);

  if (!user) return null;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 w-72 h-screen bg-white dark:bg-[#0D1117] border-r border-transparent dark:border-slate-800/50 shadow-xl shadow-slate-900/[0.06] dark:shadow-black/40 flex flex-col py-6 px-4 overflow-y-auto transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-8 px-2">
          <Link href="/feed" onClick={onClose} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/15">
              <span className="text-white font-extrabold text-[11px]">AI</span>
            </div>
            <span className="font-display font-bold text-[15px] tracking-tight text-gray-900 dark:text-white">Catalog</span>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 space-y-7">
          {navSections.map((section) => (
            <div key={section.section}>
              <h4 className="text-[10px] font-semibold tracking-wider text-slate-600 uppercase mb-2.5 px-2">
                {section.section}
              </h4>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <SidebarItem key={item.title} item={item} />
                ))}
              </div>
            </div>
          ))}

          <div>
            <h4 className="text-[10px] font-semibold tracking-wider text-slate-600 uppercase mb-2.5 px-2">
              Account
            </h4>
            <div className="space-y-0.5">
              {COMMON_ACCOUNT_NAV.map((item) => (
                <SidebarItem key={item.title} item={item} />
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
