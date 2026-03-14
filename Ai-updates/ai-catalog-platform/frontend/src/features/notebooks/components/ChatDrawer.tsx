'use client';

import { useEffect, useRef } from 'react';
import { X, Trash2, BookOpen } from 'lucide-react';
import { ChatMessageBubble } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useNotebookChat } from '../hooks/useNotebookChat';
import type { Notebook } from '../types';

interface ChatDrawerProps {
  notebook: Notebook;
  onClose: () => void;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Basics: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  Intermediate: 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400',
  Advanced: 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400',
};

export function ChatDrawer({ notebook, onClose }: ChatDrawerProps) {
  const { messages, loading, sending, error, loadHistory, sendMessage, clearHistory } = useNotebookChat(notebook.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white dark:bg-[#0B0F19] shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-start gap-3 p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
            <BookOpen size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{notebook.title}</h3>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className="text-[10px] font-medium text-slate-500">{notebook.industry.icon} {notebook.industry.name}</span>
              {notebook.gradeLevel && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400">
                  Grade {notebook.gradeLevel}
                </span>
              )}
              {notebook.difficultyLevel && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[notebook.difficultyLevel] || ''}`}>
                  {notebook.difficultyLevel}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={clearHistory}
              className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              title="Clear chat history"
            >
              <Trash2 size={14} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-10">
              <BookOpen size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-medium text-slate-500">Start a conversation</p>
              <p className="text-xs text-slate-400 mt-1">Ask questions about this notebook&apos;s content</p>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id}>
                <ChatMessageBubble text={msg.message} isUser={true} timestamp={msg.createdAt} />
                <ChatMessageBubble text={msg.response} isUser={false} timestamp={msg.createdAt} />
              </div>
            ))
          )}

          {sending && (
            <div className="flex justify-start mb-3">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-2">
              <p className="text-xs text-red-500">{error}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput onSend={sendMessage} disabled={sending} />
      </div>
    </div>
  );
}
