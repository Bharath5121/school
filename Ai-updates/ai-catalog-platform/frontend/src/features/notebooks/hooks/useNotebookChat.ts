'use client';

import { useState, useCallback, useRef } from 'react';
import { useAppStore } from '@/store/app.store';
import { API_URL } from '@/lib/config';
import type { ChatMessage, ChatSendResult } from '../types';

function getHeaders(token: string | null) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function useNotebookChat(notebookId: string) {
  const { accessToken } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const historyLoaded = useRef(false);

  const loadHistory = useCallback(async () => {
    if (historyLoaded.current || !accessToken) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/notebooks/${notebookId}/chat-history`, {
        headers: getHeaders(accessToken),
      });
      const json = await res.json();
      if (json.data) setMessages(json.data);
      historyLoaded.current = true;
    } catch {
      setError('Failed to load chat history');
    } finally {
      setLoading(false);
    }
  }, [notebookId, accessToken]);

  const sendMessage = useCallback(async (message: string): Promise<ChatSendResult | null> => {
    if (!accessToken || !message.trim()) return null;
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/notebooks/${notebookId}/chat`, {
        method: 'POST',
        headers: getHeaders(accessToken),
        body: JSON.stringify({ message }),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.message || 'Failed to send message');
        return null;
      }

      const result: ChatSendResult = json.data;
      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        message,
        response: result.text,
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, newMsg]);
      return result;
    } catch {
      setError('Failed to send message');
      return null;
    } finally {
      setSending(false);
    }
  }, [notebookId, accessToken]);

  const clearHistory = useCallback(async () => {
    if (!accessToken) return;
    try {
      await fetch(`${API_URL}/notebooks/${notebookId}/chat-history`, {
        method: 'DELETE',
        headers: getHeaders(accessToken),
      });
      setMessages([]);
      historyLoaded.current = false;
    } catch {
      setError('Failed to clear chat history');
    }
  }, [notebookId, accessToken]);

  return { messages, loading, sending, error, loadHistory, sendMessage, clearHistory };
}
