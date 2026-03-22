interface EmptyStateProps { title: string; description?: string; action?: React.ReactNode; }

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <div className="text-center py-16">
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
    {description && <p className="text-sm text-gray-500 dark:text-white/50 mb-4">{description}</p>}
    {action}
  </div>
);
