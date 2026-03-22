import { BuddyRepository } from '../repositories/buddy.repository';

/**
 * AI Model integration point.
 * Replace this function with actual model call (OpenAI, Anthropic, Gemini, etc.)
 * when ready. The function receives the full message history and returns a response.
 */
async function getAIResponse(
  _messages: Array<{ role: string; content: string }>,
  _context?: string | null,
): Promise<string> {
  // Placeholder: echo back a helpful message
  const lastUserMsg = _messages.filter(m => m.role === 'USER').pop()?.content || '';

  return `Thanks for your question! I'm Buddy, your AI learning assistant. ` +
    `I received: "${lastUserMsg.slice(0, 100)}${lastUserMsg.length > 100 ? '...' : ''}"\n\n` +
    `🚧 **AI model not connected yet.** Once an AI model is configured, I'll be able to:\n` +
    `- Answer questions about AI concepts\n` +
    `- Help with career guidance\n` +
    `- Explain discoveries and skills\n` +
    `- Assist with learning paths\n\n` +
    `This feature is coming soon!`;
}

export class BuddyService {
  private repo = new BuddyRepository();

  async getConversations(userId: string) {
    return this.repo.getConversations(userId);
  }

  async getConversation(id: string, userId: string) {
    return this.repo.getConversation(id, userId);
  }

  async getMessages(conversationId: string, userId: string) {
    return this.repo.getMessages(conversationId, userId);
  }

  async createConversation(userId: string, title?: string, context?: string) {
    return this.repo.createConversation(userId, title, context);
  }

  async sendMessage(conversationId: string, userId: string, content: string) {
    const convo = await this.repo.getConversation(conversationId, userId);
    if (!convo) return null;

    const userMessage = await this.repo.addMessage(conversationId, userId, 'USER', content);
    if (!userMessage) return null;

    const allMessages = await this.repo.getMessages(conversationId, userId);
    if (!allMessages) return null;

    const history = allMessages.map(m => ({ role: m.role, content: m.content }));

    const aiResponseText = await getAIResponse(history, convo.context);
    const assistantMessage = await this.repo.addMessage(conversationId, userId, 'ASSISTANT', aiResponseText);
    if (!assistantMessage) return null;

    // Auto-title on first message
    const msgCount = await this.repo.getMessageCount(conversationId);
    if (msgCount <= 2 && convo.title === 'New Conversation') {
      const shortTitle = content.slice(0, 60) + (content.length > 60 ? '...' : '');
      await this.repo.updateTitle(conversationId, userId, shortTitle);
    }

    return { userMessage, assistantMessage };
  }

  async updateTitle(id: string, userId: string, title: string) {
    return this.repo.updateTitle(id, userId, title);
  }

  async deleteConversation(id: string, userId: string) {
    return this.repo.deleteConversation(id, userId);
  }
}
