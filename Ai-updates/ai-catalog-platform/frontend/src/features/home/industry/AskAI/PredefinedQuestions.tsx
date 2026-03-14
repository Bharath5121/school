'use client';

const QUESTION_COLORS = [
  'bg-rose-50 dark:bg-slate-800/40 border-rose-100 dark:border-slate-700/40 hover:bg-rose-100/60 dark:hover:bg-[#151C2C] hover:border-rose-200 dark:hover:border-slate-500/50 text-rose-700 dark:text-slate-400 hover:text-rose-800 dark:hover:text-white',
  'bg-blue-50 dark:bg-slate-800/40 border-blue-100 dark:border-slate-700/40 hover:bg-blue-100/60 dark:hover:bg-[#151C2C] hover:border-blue-200 dark:hover:border-slate-500/50 text-blue-700 dark:text-slate-400 hover:text-blue-800 dark:hover:text-white',
  'bg-emerald-50 dark:bg-slate-800/40 border-emerald-100 dark:border-slate-700/40 hover:bg-emerald-100/60 dark:hover:bg-[#151C2C] hover:border-emerald-200 dark:hover:border-slate-500/50 text-emerald-700 dark:text-slate-400 hover:text-emerald-800 dark:hover:text-white',
  'bg-violet-50 dark:bg-slate-800/40 border-violet-100 dark:border-slate-700/40 hover:bg-violet-100/60 dark:hover:bg-[#151C2C] hover:border-violet-200 dark:hover:border-slate-500/50 text-violet-700 dark:text-slate-400 hover:text-violet-800 dark:hover:text-white',
  'bg-amber-50 dark:bg-slate-800/40 border-amber-100 dark:border-slate-700/40 hover:bg-amber-100/60 dark:hover:bg-[#151C2C] hover:border-amber-200 dark:hover:border-slate-500/50 text-amber-700 dark:text-slate-400 hover:text-amber-800 dark:hover:text-white',
];

export const PredefinedQuestions = ({ 
  questions, 
  onSelect,
  disabled 
}: { 
  questions: any[]; 
  onSelect: (q: string) => void;
  disabled?: boolean;
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {questions.map((q, index) => (
        <button
          key={q.id}
          onClick={() => onSelect(q.question)}
          disabled={disabled}
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all disabled:opacity-40 ${QUESTION_COLORS[index % QUESTION_COLORS.length]}`}
        >
          {q.question}
        </button>
      ))}
    </div>
  );
};
