import type { Request, Response } from "express";
import * as partnerService from "../services/partner.service.js";
import { success } from "../utils/api-response.js";
import { asyncHandler } from "../middleware/error-handler.js";

export const listAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const partners = await partnerService.listAdminPartners();
  return success(res, partners);
});

export const listPublic = asyncHandler(async (_req: Request, res: Response) => {
  const partners = await partnerService.listPublicPartners();
  return success(res, partners);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const partner = await partnerService.getPartnerById(req.params.id as string);
  return success(res, partner);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const partner = await partnerService.createPartner(req.body);
  return success(res, partner, 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const partner = await partnerService.updatePartner(
    req.params.id as string,
    req.body,
  );
  return success(res, partner);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const result = await partnerService.deletePartner(req.params.id as string);
  return success(res, result);
});
