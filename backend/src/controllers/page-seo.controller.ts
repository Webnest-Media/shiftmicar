import type { Request, Response } from "express";
import * as pageSeoService from "../services/page-seo.service.js";
import { success } from "../utils/api-response.js";
import { asyncHandler } from "../middleware/error-handler.js";

export const listAll = asyncHandler(async (_req: Request, res: Response) => {
  const data = await pageSeoService.listAllPageSeo();
  return success(res, data);
});

export const getByPath = asyncHandler(async (req: Request, res: Response) => {
  const pagePath = req.query.path ? String(req.query.path) : (req.params.pagePath ? String(req.params.pagePath) : "/");
  const data = await pageSeoService.getPageSeoByPath(pagePath);
  return success(res, data);
});

export const upsert = asyncHandler(async (req: Request, res: Response) => {
  const pagePath = req.body.pagePath || (req.query.path ? String(req.query.path) : "/");
  const data = await pageSeoService.upsertPageSeo(pagePath, req.body);
  return success(res, data);
});
