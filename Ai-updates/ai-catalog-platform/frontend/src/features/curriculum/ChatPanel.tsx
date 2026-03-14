'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Send, MessageCircle, Hash, Users } from 'lucide-react';
import { useAppStore } from '@/store/app.store';

interface ChatMessage {
  id: string;
  message: string;
  channel: string;
  createdAt: string;
  user: { id: string; name: string; role: string };
}

const CHANNELS = [
  { key: 'general', label: 'General', icon: <Hash size={14} /> },
  { key: 'models', label: 'Models', icon: <Hash size={14} /> },
  { key: 'agents', label: 'Agents', icon: <Hash size={14} /> },
];

const POLL_INTERVAL = 4000;
const AVATAR_COLORS = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
  'from-fuchsia-500 to-pink-600',
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;

  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export function ChatPanel() {
  const { accessToken, user } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [channel, setChannel] = useState('general');
  const [sending, setSending] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const latestTimestampRef = useRef<string | null>(null);
  const shouldAutoScroll = useRef(true);

  const scrollToBottom = useCallback(() => {
    if (shouldAutoScroll.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    shouldAutoScroll.current = scrollHeight - scrollTop - clientHeight < 100;
  }, []);

  const fetchMessages = useCallback(async (isPolling = false) => {
    if (!accessToken) return;
    try {
      const params = new URLSearchParams({ channel, limit: '50' });
      if (isPolling && latestTimestampRef.current) {
        params.set('after', latestTimestampRef.current);
      }
      const res = await fetch(`/api/chat/messages?${params}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) return;
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        if (isPolling && json.data.length > 0) {
          setMessages(prev => [...prev, ...json.data]);
        } else if (!isPolling) {
          setMessages(json.data);
        }
        if (json.data.length > 0) {
          latestTimestampRef.current = json.data[json.data.length - 1].createdAt;
        }
      }
    } catch {
      // silently ignore polling errors
    }
  }, [accessToken, channel]);

  useEffect(() => {
    latestTimestampRef.current = null;
    setMessages([]);
    setInitialLoad(true);
    fetchMessages(false).then(() => {
      setInitialLoad(false);
      shouldAutoScroll.current = true;
      setTimeout(() => messagesEndRef.current?.scrollIntoView(), 50);
    });
  }, [channel, fetchMessages]);

  useEffect(() => {
    const interval = setInterval(() => fetchMessages(true), POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async () => {
    if (!input.trim() || !accessToken || sending) return;
    setSending(true);
    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channel, message: input.trim() }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setMessages(prev => [...prev, json.data]);
          latestTimestampRef.current = json.data.createdAt;
        }
        setInput('');
        shouldAutoScroll.current = true;
      }
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!accessToken) {
    return (
      <div className="text-center py-16">
        <MessageCircle size={40} className="mx-auto mb-3 text-slate-400" />
        <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">Sign in to Chat</p>
        <p className="text-sm text-slate-500">Log in to join the class discussion.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-sm" style={{ height: '600px' }}>
      {/* Channel bar */}
      <div className="flex items-center gap-1 px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800/60">
        <Users size={16} className="text-slate-500 mr-2" />
        {CHANNELS.map(ch => (
          <button
            key={ch.key}
            onClick={() => setChannel(ch.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              channel === ch.key
                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            {ch.icon} {ch.label}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-slate-400">
          {messages.length} message{messages.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Messages area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-1"
      >
        {initialLoad ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle size={32} className="text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No messages yet</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Be the first to start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => {
              const isOwn = msg.user.id === user?.id;
              const showAvatar = idx === 0 || messages[idx - 1].user.id !== msg.user.id;
              const avatarColor = getAvatarColor(msg.user.name);

              return (
                <div key={msg.id} className={`flex gap-2.5 ${showAvatar ? 'mt-3' : 'mt-0.5'} ${isOwn ? 'flex-row-reverse' : ''}`}>
                  {showAvatar ? (
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center shrink-0 shadow-sm`}>
                      <span className="text-white text-xs font-bold">{msg.user.name.charAt(0).toUpperCase()}</span>
                    </div>
                  ) : (
                    <div className="w-8 shrink-0" />
                  )}
                  <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
                    {showAvatar && (
                      <div className={`flex items-center gap-2 mb-0.5 ${isOwn ? 'justify-end' : ''}`}>
                        <span className="text-xs font-semibold text-gray-800 dark:text-slate-200">{msg.user.name}</span>
                        {msg.user.role !== 'STUDENT' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">{msg.user.role}</span>
                        )}
                        <span className="text-[10px] text-slate-400">{formatTime(msg.createdAt)}</span>
                      </div>
                    )}
                    <div className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                      isOwn
                        ? 'bg-indigo-500 text-white rounded-tr-md'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-gray-800 dark:text-slate-200 rounded-tl-md'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800/60">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/50 px-4 py-2.5 text-sm text-gray-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all"
            style={{ maxHeight: '100px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 100) + 'px';
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || sending}
            className="h-10 w-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center hover:shadow-md hover:shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  );
}
