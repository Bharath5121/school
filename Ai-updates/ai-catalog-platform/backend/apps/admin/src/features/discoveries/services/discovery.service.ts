import { discoveryRepository } from '../repositories/discovery.repository';

export class DiscoveryService {
  async list(query: { search?: string; industrySlug?: string; page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;
    const { items, total } = await discoveryRepository.findAll({
      search: query.search,
      industrySlug: query.industrySlug,
      skip,
      take: limit,
    });
    return { items, total, page, limit };
  }

  async getById(id: string) {
    const item = await discoveryRepository.findById(id);
    if (!item) throw new Error('Discovery not found');
    return item;
  }

  async create(data: any) {
    return discoveryRepository.create(data);
  }

  async update(id: string, data: any) {
    return discoveryRepository.update(id, data);
  }

  async delete(id: string) {
    return discoveryRepository.delete(id);
  }

  async addLink(discoveryId: string, linkData: any) {
    return discoveryRepository.addLink(discoveryId, linkData);
  }

  async removeLink(linkId: string) {
    return discoveryRepository.removeLink(linkId);
  }

  async togglePublish(id: string) {
    return discoveryRepository.togglePublish(id);
  }
}

export const discoveryService = new DiscoveryService();
