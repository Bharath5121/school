'use client';

interface ChatMessageProps {
  text: string;
  isUser: boolean;
  timestamp: string;
}

export function ChatMessageBubble({ text, isUser, timestamp }: ChatMessageProps) {
  const time = new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
        isUser
          ? 'bg-indigo-500 text-white rounded-br-md'
          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-gray-800 dark:text-slate-200 rounded-bl-md'
      }`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
        <p className={`text-[10px] mt-1 ${isUser ? 'text-indigo-200' : 'text-slate-400'}`}>{time}</p>
      </div>
    </div>
  );
}
