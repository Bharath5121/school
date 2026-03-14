import axios from 'axios';
import { API_URL } from '@/lib/config';
import { logger } from '@/lib/logger';

export const askAiApi = {
  getPredefinedQuestions: async (slug: string) => {
    const response = await axios.get(`${API_URL}/home/ask/questions/${slug}`);
    return response.data.data;
  },

  askQuestion: async (question: string, fieldSlug: string, onMessage: (text: string) => void) => {
    const response = await fetch(`${API_URL}/home/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, fieldSlug }),
    });

    if (!response.ok) throw new Error('Failed to start AI session');

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.replace('data: ', ''));
            if (data.text) onMessage(data.text);
          } catch (e) {
            logger.error('Error parsing SSE data', e);
          }
        }
      }
    }
  }
};
