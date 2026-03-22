'use client';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ToastProps { message: string; type?: 'success' | 'error' | 'info'; onClose: () => void; duration?: number; }

export const Toast = ({ message, type = 'info', onClose, duration = 4000 }: ToastProps) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => { setVisible(false); setTimeout(onClose, 300); }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={cn(
      'fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all duration-300',
      visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
      type === 'success' && 'bg-emerald-500 text-white',
      type === 'error' && 'bg-red-500 text-white',
      type === 'info' && 'bg-gray-900 dark:bg-white text-white dark:text-gray-900',
    )}>
      {message}
    </div>
  );
};
