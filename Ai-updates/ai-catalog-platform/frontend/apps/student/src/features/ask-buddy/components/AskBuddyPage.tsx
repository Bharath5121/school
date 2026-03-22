'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Bot, Send, Plus, Trash2, MessageSquare } from 'lucide-react';
import { buddyApi, type BuddyConversation, type BuddyMessage } from '../services/buddy.api';

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function MessageBubble({ msg }: { msg: BuddyMessage }) {
  const isUser = msg.role === 'USER';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
        isUser
          ? 'bg-emerald-500 text-white rounded-br-md'
          : 'bg-gray-100 dark:bg-white/[0.06] text-gray-900 dark:text-white border border-gray-200/60 dark:border-white/10 rounded-bl-md'
      }`}>
        {!isUser && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <Bot size={12} className="text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Buddy</span>
          </div>
        )}
        <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
        <p className={`text-[10px] mt-1.5 ${isUser ? 'text-emerald-100' : 'text-gray-400 dark:text-slate-500'}`}>
          {formatTime(msg.createdAt)}
        </p>
      </div>
    </div>
  );
}

export function AskBuddyPage() {
  const [conversations, setConversations] = useState<BuddyConversation[]>([]);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [messages, setMessages] = useState<BuddyMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  useEffect(() => {
    buddyApi.getConversations()
      .then(setConversations)
      .catch(() => setConversations([]))
      .finally(() => setLoading(false));
  }, []);

  const loadMessages = useCallback(async (convoId: string) => {
    setActiveConvoId(convoId);
    const msgs = await buddyApi.getMessages(convoId);
    setMessages(msgs);
  }, []);

  const handleNewConversation = async () => {
    const convo = await buddyApi.createConversation();
    if (convo) {
      setConversations(prev => [convo, ...prev]);
      setActiveConvoId(convo.id);
      setMessages([]);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    await buddyApi.deleteConversation(id);
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConvoId === id) {
      setActiveConvoId(null);
      setMessages([]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    let convoId = activeConvoId;

    if (!convoId) {
      const convo = await buddyApi.createConversation();
      if (!convo) return;
      convoId = convo.id;
      setConversations(prev => [convo, ...prev]);
      setActiveConvoId(convoId);
    }

    const msgText = input.trim();
    setInput('');
    setSending(true);

    const optimisticUser: BuddyMessage = {
      id: `temp-${Date.now()}`,
      conversationId: convoId,
      role: 'USER',
      content: msgText,
      metadata: {},
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticUser]);

    const result = await buddyApi.sendMessage(convoId, msgText);
    if (result) {
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== optimisticUser.id);
        return [...filtered, result.userMessage, result.assistantMessage];
      });
      setConversations(prev =>
        prev.map(c => c.id === convoId
          ? { ...c, title: msgText.slice(0, 60) + (msgText.length > 60 ? '...' : ''), updatedAt: new Date().toISOString() }
          : c
        )
      );
    }

    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-5 shadow-lg shadow-emerald-500/15">
        <div className="flex items-center gap-3">
          <Bot size={20} className="text-white/90" />
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight">Ask Buddy</h1>
            <p className="text-emerald-100 text-[11px] mt-0.5">Your AI learning assistant &mdash; ask anything about AI, careers, and skills</p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex gap-4 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Conversations Sidebar */}
        {showSidebar && (
          <div className="w-64 shrink-0 rounded-2xl border border-emerald-100/80 dark:border-emerald-500/15 bg-gradient-to-br from-emerald-50/50 via-white to-white dark:from-emerald-500/[0.04] dark:via-transparent dark:to-transparent overflow-hidden flex flex-col">
            <div className="p-3 border-b border-emerald-100/60 dark:border-emerald-500/10">
              <button
                onClick={handleNewConversation}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20"
              >
                <Plus size={14} /> New Chat
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/5 animate-pulse" />
                ))
              ) : conversations.length === 0 ? (
                <div className="text-center py-8 px-3">
                  <MessageSquare size={20} className="mx-auto text-emerald-400/50 mb-2" />
                  <p className="text-[11px] text-gray-400 dark:text-slate-500">No conversations yet</p>
                </div>
              ) : (
                conversations.map(c => (
                  <div
                    key={c.id}
                    className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                      activeConvoId === c.id
                        ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/20'
                        : 'hover:bg-emerald-50 dark:hover:bg-emerald-500/5'
                    }`}
                    onClick={() => loadMessages(c.id)}
                  >
                    <MessageSquare size={13} className="text-emerald-500 shrink-0" />
                    <span className="text-xs font-medium text-gray-700 dark:text-white/70 truncate flex-1">{c.title}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteConversation(c.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col rounded-2xl border border-emerald-100/80 dark:border-emerald-500/15 bg-white dark:bg-white/[0.02] overflow-hidden">
          {/* Toggle Sidebar */}
          <div className="flex items-center px-4 py-2 border-b border-emerald-100/60 dark:border-emerald-500/10">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-[11px] font-medium text-gray-400 dark:text-slate-500 hover:text-emerald-500 transition-colors"
            >
              {showSidebar ? '← Hide chats' : '→ Show chats'}
            </button>
            {activeConvoId && (
              <span className="ml-auto text-[11px] text-gray-400 dark:text-slate-500">
                {conversations.find(c => c.id === activeConvoId)?.title || 'Chat'}
              </span>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {!activeConvoId && messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg mb-4">
                  <Bot size={28} className="text-white" />
                </div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">Hey! I&apos;m Buddy</h2>
                <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm mb-6">
                  Your AI learning assistant. Ask me anything about AI concepts, career paths, skills, or anything you&apos;re curious about.
                </p>
                <div className="grid grid-cols-2 gap-2 max-w-sm w-full">
                  {[
                    'What is machine learning?',
                    'Best AI careers in 2035?',
                    'Explain neural networks',
                    'How to start learning AI?',
                  ].map(q => (
                    <button
                      key={q}
                      onClick={() => { setInput(q); }}
                      className="text-left px-3 py-2.5 rounded-xl border border-emerald-100/80 dark:border-emerald-500/15 bg-emerald-50/30 dark:bg-emerald-500/[0.04] text-xs text-gray-700 dark:text-white/60 hover:border-emerald-300 dark:hover:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
                {sending && (
                  <div className="flex justify-start mb-3">
                    <div className="bg-gray-100 dark:bg-white/[0.06] border border-gray-200/60 dark:border-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Bot size={12} className="text-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Buddy</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-emerald-100/60 dark:border-emerald-500/10">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Buddy anything..."
                rows={1}
                className="flex-1 resize-none rounded-xl border border-emerald-200/60 dark:border-emerald-500/15 bg-emerald-50/30 dark:bg-emerald-500/[0.04] px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 dark:focus:border-emerald-500/30 transition-all"
                style={{ minHeight: '42px', maxHeight: '120px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = '42px';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="shrink-0 w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-md shadow-emerald-500/20"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
