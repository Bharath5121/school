'use client';
import { useState, useEffect } from 'react';
import { PredefinedQuestions } from './PredefinedQuestions';
import { AIResponse } from './AIResponse';
import { useAskAI } from '../../hooks/useAskAI';
import { askAiApi } from '../../services/askAI.api';
import Link from 'next/link';
import { Send } from 'lucide-react';

export const AskAIPanel = ({ fieldSlug, industryName }: { fieldSlug: string; industryName: string }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const { response, loading, ask } = useAskAI(fieldSlug);

  useEffect(() => {
    askAiApi.getPredefinedQuestions(fieldSlug).then(setQuestions);
  }, [fieldSlug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      ask(input);
      setInput('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-900 dark:text-white">AI Assistant: {industryName}</h2>
        <p className="text-slate-600 dark:text-slate-500 text-sm">Ask anything about tools, trends, and career impact.</p>
      </div>

      <PredefinedQuestions questions={questions} onSelect={ask} disabled={loading} />

      <form onSubmit={handleSubmit} className="relative mb-8">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="w-full bg-white dark:bg-[#111827] shadow-[0_2px_8px_rgba(16,185,129,0.06),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-emerald-100 dark:border-slate-700/40 rounded-xl py-3.5 pl-5 pr-14 outline-none focus:border-emerald-300 dark:focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-500/20 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-600 text-sm"
        />
        <button 
          type="submit"
          disabled={!input.trim() || loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-emerald-500 text-white rounded-lg disabled:opacity-30 transition-all active:scale-95 hover:bg-emerald-400 flex items-center justify-center"
        >
          <Send size={14} />
        </button>
      </form>

      <AIResponse text={response} loading={loading} />

      <div className="mt-8 flex items-center justify-between text-slate-600 dark:text-slate-500 text-xs px-1">
        <span>Guest Limit: 10/hr</span>
        <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">Unlimited Access &rarr;</Link>
      </div>
    </div>
  );
};
