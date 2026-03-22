interface ErrorMessageProps { message: string; onRetry?: () => void; }

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => (
  <div className="text-center py-12">
    <p className="text-red-500 text-sm mb-4">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="px-4 py-2 text-sm font-medium bg-emerald-500 text-white rounded-xl hover:bg-emerald-400 transition-colors">
        Try Again
      </button>
    )}
  </div>
);
