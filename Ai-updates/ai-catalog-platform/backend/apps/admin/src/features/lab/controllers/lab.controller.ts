import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { LabService } from '../services/lab.service';
import { ApiResponse } from '../../../shared/response/ApiResponse';

export class LabController {
  private service = new LabService();

  getCategories = asyncHandler(async (_req: Request, res: Response) => {
    const data = await this.service.getAllCategories();
    res.json(ApiResponse.success(data));
  });

  getCategory = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getCategoryById(req.params.id);
    if (!data) { res.status(404).json(ApiResponse.error('Category not found')); return; }
    res.json(ApiResponse.success(data));
  });

  createCategory = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.createCategory(req.body);
    res.status(201).json(ApiResponse.success(data, 'Category created'));
  });

  updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.updateCategory(req.params.id, req.body);
    res.json(ApiResponse.success(data, 'Category updated'));
  });

  deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteCategory(req.params.id);
    res.json(ApiResponse.success(null, 'Category deleted'));
  });

  getItems = asyncHandler(async (_req: Request, res: Response) => {
    const data = await this.service.getAllItems();
    res.json(ApiResponse.success(data));
  });

  getItem = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getItemById(req.params.id);
    if (!data) { res.status(404).json(ApiResponse.error('Item not found')); return; }
    res.json(ApiResponse.success(data));
  });

  createItem = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.createItem(req.body);
    res.status(201).json(ApiResponse.success(data, 'Item created'));
  });

  updateItem = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.updateItem(req.params.id, req.body);
    res.json(ApiResponse.success(data, 'Item updated'));
  });

  deleteItem = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteItem(req.params.id);
    res.json(ApiResponse.success(null, 'Item deleted'));
  });
}
