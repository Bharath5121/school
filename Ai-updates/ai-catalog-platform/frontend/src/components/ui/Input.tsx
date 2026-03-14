import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from './Button';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-lg border border-slate-200 dark:border-slate-700/40 bg-white dark:bg-[#0B0F19] px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-slate-600 transition-all duration-200 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
