'use client';
import { useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: 'left' | 'right';
  className?: string;
}

export const Drawer = ({ open, onClose, title, children, side = 'right', className }: DrawerProps) => {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={cn(
        'absolute top-0 bottom-0 bg-white dark:bg-gray-900 shadow-2xl border-gray-200 dark:border-white/10',
        'w-full max-w-md overflow-y-auto',
        side === 'right' ? 'right-0 border-l animate-in slide-in-from-right duration-300' : 'left-0 border-r animate-in slide-in-from-left duration-300',
        className
      )}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button onClick={onClose} className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white text-xl leading-none">&times;</button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
