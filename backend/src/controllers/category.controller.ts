import type { Request, Response } from "express";
import * as categoryService from "../services/category.service.js";
import { success } from "../utils/api-response.js";
import { asyncHandler } from "../middleware/error-handler.js";

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await categoryService.listCategories();
  return success(res, categories);
});

export const getBySlug = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.getCategoryBySlug(req.params.slug as string);
  return success(res, category);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body);
  return success(res, category, 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.updateCategory(req.params.id as string, req.body);
  return success(res, category);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const result = await categoryService.deleteCategory(req.params.id as string);
  return success(res, result);
});
