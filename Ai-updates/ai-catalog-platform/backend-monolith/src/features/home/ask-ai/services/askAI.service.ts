import Anthropic from '@anthropic-ai/sdk';
import { env } from '../../../../config/env';
import logger from '../../../../shared/logger/logger';

export class AskAIService {
  private anthropic: Anthropic | null = null;

  constructor() {
    if (env.CLAUDE_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: env.CLAUDE_API_KEY,
      });
    }
  }

  async streamResponse(question: string, fieldSlug: string, res: any) {
    if (!this.anthropic) {
      // Mock response if no API key
      const mockResponse = `This is a simulated AI response for "${question}" in the field of ${fieldSlug}. Please configure CLAUDE_API_KEY to see real insights. AI is transforming this industry by automating repetitive tasks and providing data-driven decision support.`;
      
      res.write(`data: ${JSON.stringify({ text: mockResponse })}\n\n`);
      res.end();
      return;
    }

    try {
      const systemPrompt = `You are an AI assistant for the AI Catalog Platform. You provide expert insights into how Artificial Intelligence is transforming various industries. 
      The current field is: ${fieldSlug}. 
      Your tone is professional, encouraging, and focused on career growth and learning. 
      Keep responses concise and structured. Use plain English for a 14-year-old to understand easily.`;

      const stream = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: question }],
        stream: true,
      });

      for await (const messageStreamEvent of stream) {
        if (messageStreamEvent.type === 'content_block_delta' && messageStreamEvent.delta.type === 'text_delta') {
          res.write(`data: ${JSON.stringify({ text: messageStreamEvent.delta.text })}\n\n`);
        }
      }
      res.end();
    } catch (error) {
      logger.error('Claude API Error', error);
      res.write(`data: ${JSON.stringify({ error: 'Failed to generate response' })}\n\n`);
      res.end();
    }
  }
}
