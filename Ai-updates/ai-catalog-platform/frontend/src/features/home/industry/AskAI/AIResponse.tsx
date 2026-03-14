'use client';

export const AIResponse = ({ text, loading }: { text: string; loading: boolean }) => {
  if (!text && !loading) return null;

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 dark:from-[#111827] dark:via-[#111827] dark:to-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-emerald-100 dark:border-slate-700/40 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full" />
      
      <div className="flex items-center gap-2.5 mb-3 pl-3">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-[10px] font-bold text-white">AI</div>
        <span className="text-xs font-medium text-emerald-600 dark:text-slate-500">AI Response</span>
      </div>

      <div className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed pl-3 whitespace-pre-wrap">
        {text}
        {loading && <span className="inline-block w-0.5 h-4 bg-emerald-400 animate-pulse ml-1 rounded-full" />}
      </div>
    </div>
  );
};
