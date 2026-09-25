import type { Request, Response } from "express";
import * as tagService from "../services/tag.service.js";
import { success } from "../utils/api-response.js";
import { asyncHandler } from "../middleware/error-handler.js";

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const tags = await tagService.listTags();
  return success(res, tags);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const tag = await tagService.createTag(req.body);
  return success(res, tag, 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const tag = await tagService.updateTag(req.params.id as string, req.body);
  return success(res, tag);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const result = await tagService.deleteTag(req.params.id as string);
  return success(res, result);
});
