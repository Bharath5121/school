import { cn } from '@/lib/utils';

interface BadgeProps { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'; className?: string; }

export const Badge = ({ children, variant = 'default', className }: BadgeProps) => (
  <span className={cn(
    'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full',
    variant === 'default' && 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/70',
    variant === 'success' && 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    variant === 'warning' && 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400',
    variant === 'danger' && 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400',
    variant === 'info' && 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400',
    className
  )}>
    {children}
  </span>
);
