import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-gray-700 dark:text-white/70">{label}</label>}
      <input
        ref={ref}
        className={cn(
          'w-full px-3 py-2 text-sm rounded-xl border bg-white dark:bg-white/5 text-gray-900 dark:text-white',
          'outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-white/30',
          error ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-gray-200 dark:border-white/10 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-500/20',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';
