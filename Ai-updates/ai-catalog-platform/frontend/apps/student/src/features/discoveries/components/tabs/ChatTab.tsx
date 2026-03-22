'use client';

import { useState, useRef, useEffect } from 'react';
import { useDiscoveryChat } from '../../hooks/useDiscoveryChat';

interface Props {
  slug: string;
}

export function ChatTab({ slug }: Props) {
  const { messages, loading, sending, error, sendMessage } = useDiscoveryChat(slug);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    try { await sendMessage(text); } catch { /* shown via hook */ }
  };

  return (
    <div className="flex flex-col h-[480px]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 p-4 bg-blue-50/30 dark:bg-blue-500/[0.02] rounded-t-xl border border-blue-100 dark:border-blue-500/10">
        {loading && <div className="text-center text-gray-400 dark:text-white/30 py-8 text-sm">Loading messages...</div>}
        {!loading && messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-3xl mb-2">💬</p>
            <p className="font-semibold text-gray-600 dark:text-white/40 text-sm">Start a conversation</p>
            <p className="text-xs text-gray-400 dark:text-white/25 mt-1">Ask questions about this discovery</p>
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400">
                {msg.user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 bg-white dark:bg-white/5 rounded-xl p-3 border border-gray-100 dark:border-white/5 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 dark:text-white/30 mb-1">{msg.user.name}</p>
                <p className="text-sm text-gray-700 dark:text-white/70">{msg.message}</p>
              </div>
            </div>
            {msg.response && (
              <div className="ml-9">
                <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-3 border border-blue-100 dark:border-blue-500/15">
                  <p className="text-sm text-gray-700 dark:text-white/70">{msg.response}</p>
                </div>
              </div>
            )}
          </div>
        ))}
        {sending && <div className="text-center text-blue-500 text-xs font-medium">Sending...</div>}
      </div>

      {error && <div className="px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs">{error}</div>}

      <div className="flex gap-2 p-3 bg-white dark:bg-white/[0.03] rounded-b-xl border border-t-0 border-blue-100 dark:border-blue-500/10">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
          disabled={sending}
        />
        <button
          onClick={handleSend}
          disabled={sending || !input.trim()}
          className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 dark:disabled:bg-white/10 text-white text-sm font-bold transition-colors shadow-md shadow-blue-500/20 disabled:shadow-none"
        >
          Send
        </button>
      </div>
    </div>
  );
}
