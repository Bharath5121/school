import { ChildrenRepository } from '../repositories/children.repository';
import { AppError } from '../../../../shared/errors/AppError';

export class ChildrenService {
  private repo = new ChildrenRepository();

  async getLinkedChildren(parentId: string) {
    return this.repo.getLinkedChildren(parentId);
  }

  async linkChild(parentId: string, childName: string, childEmail: string) {
    const student = await this.repo.findStudentByNameAndEmail(childName, childEmail);
    if (!student) {
      throw new AppError('No student account found with that name and email.', 404);
    }

    const alreadyLinked = await this.repo.linkExists(parentId, student.id);
    if (alreadyLinked) {
      throw new AppError('This student is already linked to your account.', 409);
    }

    await this.repo.linkChild(parentId, student.id);
    return { id: student.id, name: student.name, email: student.email };
  }

  async unlinkChild(parentId: string, childId: string) {
    const linked = await this.repo.linkExists(parentId, childId);
    if (!linked) {
      throw new AppError('This student is not linked to your account.', 404);
    }
    await this.repo.unlinkChild(parentId, childId);
  }
}
