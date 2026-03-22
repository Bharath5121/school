import { HTMLAttributes, forwardRef } from 'react';
import { cn } from './Button';

export const Badge = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700/40 bg-slate-100 dark:bg-slate-800/40 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors', className)}
      {...props}
    />
  )
);
Badge.displayName = 'Badge';
