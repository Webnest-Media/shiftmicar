import type { Request, Response } from "express";
import * as mediaService from "../services/media.service.js";
import { success, fail } from "../utils/api-response.js";
import { asyncHandler } from "../middleware/error-handler.js";

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const media = await mediaService.listMedia();
  return success(res, media);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    return fail(res, "No file uploaded", 400);
  }

  const media = await mediaService.createMedia(req.file);
  return success(res, media, 201);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const result = await mediaService.deleteMedia(req.params.id as string);
  return success(res, result);
});
