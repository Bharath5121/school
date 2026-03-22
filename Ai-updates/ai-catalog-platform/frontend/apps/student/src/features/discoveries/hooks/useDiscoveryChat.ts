'use client';

import { useState, useEffect, useCallback } from 'react';
import { discoveryApi } from '../services/discovery.api';
import type { ChatMessage } from '../types';

export function useDiscoveryChat(slug: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const data = await discoveryApi.getChatMessages(slug);
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chat');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  const sendMessage = useCallback(async (message: string) => {
    setSending(true);
    try {
      const msg = await discoveryApi.postChatMessage(slug, message);
      setMessages(prev => [...prev, msg]);
      return msg;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    } finally {
      setSending(false);
    }
  }, [slug]);

  return { messages, loading, sending, error, sendMessage, refresh: loadMessages };
}
