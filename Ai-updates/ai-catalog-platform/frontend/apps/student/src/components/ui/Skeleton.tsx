import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect';
}

export const Skeleton = ({ className, variant = 'rect' }: SkeletonProps) => (
  <div
    className={cn(
      'animate-pulse bg-black/5 dark:bg-white/5',
      variant === 'circle' && 'rounded-full',
      variant === 'text' && 'rounded h-4 w-full',
      variant === 'rect' && 'rounded-xl',
      className
    )}
  />
);
