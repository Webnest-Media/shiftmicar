import type { Request, Response } from "express";
import * as routeService from "../services/route.service.js";
import { success } from "../utils/api-response.js";
import { asyncHandler } from "../middleware/error-handler.js";

export const listAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const data = await routeService.listRoutesAdmin();
  return success(res, data);
});

export const listPublic = asyncHandler(async (_req: Request, res: Response) => {
  const data = await routeService.listRoutesPublic();
  return success(res, data);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const data = await routeService.getRouteById(String(req.params.id));
  return success(res, data);
});

export const getBySlug = asyncHandler(async (req: Request, res: Response) => {
  const data = await routeService.getRouteBySlug(String(req.params.slug));
  return success(res, data);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = await routeService.createRoute(req.body);
  return success(res, data, 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const data = await routeService.updateRoute(String(req.params.id), req.body);
  return success(res, data);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await routeService.deleteRoute(String(req.params.id));
  return success(res, { message: "Route deleted successfully" });
});
