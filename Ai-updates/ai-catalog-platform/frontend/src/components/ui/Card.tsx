import { HTMLAttributes, forwardRef } from 'react';
import { cn } from './Button';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-slate-700/40 rounded-2xl p-6 transition-colors', className)}
      {...props}
    />
  )
);
Card.displayName = 'Card';
