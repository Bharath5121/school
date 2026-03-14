'use client';

import { useFields } from '@/hooks/useFields';
import { cn } from '@/components/ui/Button';

export const FeedFilter = ({ currentField, onSelect }: { currentField?: string, onSelect: (f?: string) => void }) => {
  const { fields } = useFields();

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-6">
      <button 
        className={cn(
          "px-4 py-2 rounded-full text-sm whitespace-nowrap border transition-colors",
          !currentField ? "bg-primary text-white border-primary" : "border-gray-100 dark:border-white/10 hover:border-gray-200 dark:hover:border-white/30 text-black/70 dark:text-white/70"
        )}
        onClick={() => onSelect(undefined)}
      >
        All Fields
      </button>
      {fields.map(f => (
        <button
          key={f.slug}
          className={cn(
            "px-4 py-2 rounded-full text-sm whitespace-nowrap border transition-colors",
            currentField === f.slug ? "bg-primary text-white border-primary" : "border-gray-100 dark:border-white/10 hover:border-gray-200 dark:hover:border-white/30 text-black/70 dark:text-white/70 hover:text-gray-900 dark:hover:text-white"
          )}
          onClick={() => onSelect(f.slug)}
        >
          {f.icon} {f.name}
        </button>
      ))}
    </div>
  );
};
