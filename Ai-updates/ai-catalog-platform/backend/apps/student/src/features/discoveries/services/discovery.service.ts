import { discoveryRepository } from '../repositories/discovery.repository';

export class DiscoveryService {
  async listPublished(query: { featured?: string; page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const featured = query.featured === 'true' ? true : query.featured === 'false' ? false : undefined;

    const { items, total } = await discoveryRepository.findPublished({ featured, skip, take: limit });
    return { items, total, page, limit };
  }

  async getBySlug(slug: string) {
    const item = await discoveryRepository.findBySlug(slug);
    if (!item) throw new Error('Discovery not found');
    return item;
  }

  async getChatMessages(slug: string) {
    const discovery = await discoveryRepository.findBySlug(slug);
    if (!discovery) throw new Error('Discovery not found');
    return discoveryRepository.getChatMessages(discovery.id);
  }

  async postChatMessage(slug: string, userId: string, message: string) {
    const discovery = await discoveryRepository.findBySlug(slug);
    if (!discovery) throw new Error('Discovery not found');
    return discoveryRepository.createChatMessage(discovery.id, userId, message);
  }
}

export const discoveryService = new DiscoveryService();
