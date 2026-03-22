import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400',
  warning: 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  danger: 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400',
  outline: 'border border-gray-200 dark:border-white/10 text-black/60 dark:text-white/60',
};

export const Badge = ({ variant = 'default', className, children, ...props }: BadgeProps) => (
  <span
    className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variantStyles[variant], className)}
    {...props}
  >
    {children}
  </span>
);
