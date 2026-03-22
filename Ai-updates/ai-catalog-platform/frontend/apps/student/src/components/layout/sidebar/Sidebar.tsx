'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { SidebarItem } from './SidebarItem';
import { STUDENT_NAV } from './nav-config';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar = ({ open, onClose }: SidebarProps) => {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-screen flex flex-col overflow-y-auto transition-transform duration-300 ease-in-out bg-emerald-950 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-emerald-900/50">
          <Link href="/discoveries" onClick={onClose} className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <span className="text-white font-extrabold text-[10px]">AI</span>
            </div>
            <span className="font-bold text-[15px] tracking-tight text-white">Catalog</span>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-400/60 hover:text-white hover:bg-emerald-800/50 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-4 space-y-5">
          {STUDENT_NAV.map((section) => (
            <div key={section.section}>
              {section.section && (
                <h4 className="text-[10px] font-bold tracking-[0.15em] uppercase text-emerald-500/70 mb-2 px-3">
                  {section.section}
                </h4>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <SidebarItem key={item.title} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-emerald-900/50">
          <div className="text-[10px] text-emerald-600/60 text-center">
            AI Catalog v1.0
          </div>
        </div>
      </aside>
    </>
  );
};
