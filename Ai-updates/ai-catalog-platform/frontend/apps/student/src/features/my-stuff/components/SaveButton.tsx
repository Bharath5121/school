'use client';

import { Bookmark } from 'lucide-react';
import { useSaveButton } from '../hooks/useSaved';

interface SaveButtonProps {
  contentType: string;
  contentId: string;
  title: string;
  url?: string;
  metadata?: any;
  size?: 'sm' | 'md';
  className?: string;
}

export function SaveButton({ contentType, contentId, title, url, metadata, size = 'sm', className = '' }: SaveButtonProps) {
  const { saved, loading, toggle } = useSaveButton(contentType, contentId, title, url, metadata);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle();
  };

  const sizeClasses = size === 'md'
    ? 'w-9 h-9'
    : 'w-7 h-7';

  const iconSize = size === 'md' ? 16 : 14;

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title={saved ? 'Remove from saved' : 'Save item'}
      className={`${sizeClasses} rounded-lg flex items-center justify-center transition-all duration-200 ${
        saved
          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-600'
          : 'bg-white/80 dark:bg-white/10 text-gray-400 dark:text-white/30 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border border-gray-200/60 dark:border-white/10'
      } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      <Bookmark size={iconSize} fill={saved ? 'currentColor' : 'none'} />
    </button>
  );
}
