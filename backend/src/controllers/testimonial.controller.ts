import type { Request, Response } from "express";
import * as testimonialService from "../services/testimonial.service.js";
import { success } from "../utils/api-response.js";
import { asyncHandler } from "../middleware/error-handler.js";

export const listAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const testimonials = await testimonialService.listAdminTestimonials();
  return success(res, testimonials);
});

export const listPublic = asyncHandler(async (_req: Request, res: Response) => {
  const testimonials = await testimonialService.listPublicTestimonials();
  return success(res, testimonials);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const testimonial = await testimonialService.getTestimonialById(req.params.id as string);
  return success(res, testimonial);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const testimonial = await testimonialService.createTestimonial(req.body);
  return success(res, testimonial, 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const testimonial = await testimonialService.updateTestimonial(
    req.params.id as string,
    req.body,
  );
  return success(res, testimonial);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const result = await testimonialService.deleteTestimonial(req.params.id as string);
  return success(res, result);
});
