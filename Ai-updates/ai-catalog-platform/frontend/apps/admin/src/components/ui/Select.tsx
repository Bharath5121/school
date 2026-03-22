import { cn } from '@/lib/utils';
import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-gray-700 dark:text-white/70">{label}</label>}
      <select
        ref={ref}
        className={cn(
          'w-full px-3 py-2 text-sm rounded-xl border bg-white dark:bg-white/5 text-gray-900 dark:text-white outline-none transition-all',
          error ? 'border-red-400' : 'border-gray-200 dark:border-white/10 focus:border-emerald-300',
          className
        )}
        {...props}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
);
Select.displayName = 'Select';
