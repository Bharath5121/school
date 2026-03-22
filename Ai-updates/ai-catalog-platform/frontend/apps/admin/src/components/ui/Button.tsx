import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' && 'bg-emerald-500 text-white hover:bg-emerald-400 active:scale-[0.98]',
        variant === 'secondary' && 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/10',
        variant === 'danger' && 'bg-red-500 text-white hover:bg-red-400',
        variant === 'ghost' && 'bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70',
        size === 'sm' && 'text-xs px-3 py-1.5',
        size === 'md' && 'text-sm px-4 py-2',
        size === 'lg' && 'text-base px-6 py-3',
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';
