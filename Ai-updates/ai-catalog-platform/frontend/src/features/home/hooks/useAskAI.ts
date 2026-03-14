import { useState } from 'react';
import { askAiApi } from '../services/askAI.api';

export const useAskAI = (fieldSlug: string) => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ask = async (question: string) => {
    setLoading(true);
    setError(null);
    setResponse('');

    try {
      await askAiApi.askQuestion(question, fieldSlug, (text) => {
        setResponse((prev) => prev + text);
      });
    } catch (err: any) {
      setError(err.message || 'Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  return { response, loading, error, ask };
};
