import type { Request, Response } from "express";
import * as serviceService from "../services/service.service.js";
import { success } from "../utils/api-response.js";
import { asyncHandler } from "../middleware/error-handler.js";

export const listAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const data = await serviceService.listServicesAdmin();
  return success(res, data);
});

export const listPublic = asyncHandler(async (_req: Request, res: Response) => {
  const data = await serviceService.listServicesPublic();
  return success(res, data);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const data = await serviceService.getServiceById(String(req.params.id));
  return success(res, data);
});

export const getBySlug = asyncHandler(async (req: Request, res: Response) => {
  const data = await serviceService.getServiceBySlug(String(req.params.slug));
  return success(res, data);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = await serviceService.createService(req.body);
  return success(res, data, 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const data = await serviceService.updateService(String(req.params.id), req.body);
  return success(res, data);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await serviceService.deleteService(String(req.params.id));
  return success(res, { message: "Service deleted successfully" });
});
