import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { UsersService } from '../services/users.service';
import { ApiResponse } from '../../../shared/response/ApiResponse';
import { PaginatedResponse } from '../../../shared/response/PaginatedResponse';

export class UsersController {
  private service = new UsersService();

  listUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const role = req.query.role as string | undefined;
    const search = req.query.search as string | undefined;
    const result = await this.service.listUsers(page, limit, role, search);
    res.json(PaginatedResponse.create(result.users, result.total, result.page, result.limit));
  });

  getUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.service.getUserById(req.params.id);
    res.json(ApiResponse.success(user));
  });

  updateRole = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.updateUserRole(req.params.id, req.body.role);
    res.json(ApiResponse.success(result, 'Role updated'));
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.deleteUser(req.params.id);
    res.json(ApiResponse.success(result, 'User soft-deleted'));
  });
}
