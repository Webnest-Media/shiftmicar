import type { Request, Response } from "express";
import * as blogService from "../services/blog.service.js";
import { success } from "../utils/api-response.js";
import { asyncHandler } from "../middleware/error-handler.js";
import type { BlogStatus } from "@prisma/client";

type ListQuery = {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  tag?: string;
  status?: BlogStatus;
  author?: string;
  from?: string;
  to?: string;
  sort?: "newest" | "oldest" | "updated";
};

export const listPublic = asyncHandler(async (req: Request, res: Response) => {
  const query = (req as Request & { validatedQuery: ListQuery }).validatedQuery;
  const result = await blogService.listPublicBlogs(query);
  return res.status(200).json({ success: true, ...result });
});

export const getPublicBySlug = asyncHandler(async (req: Request, res: Response) => {
  const blog = await blogService.getPublicBlogBySlug(req.params.slug as string);
  const related = await blogService.getRelatedPublicBlogs(blog.id, blog.category?.id);
  return success(res, { blog, related });
});

export const listAdmin = asyncHandler(async (req: Request, res: Response) => {
  const query = (req as Request & { validatedQuery: ListQuery }).validatedQuery;
  const result = await blogService.listAdminBlogs(query);
  return res.status(200).json({ success: true, ...result });
});

export const getAdminById = asyncHandler(async (req: Request, res: Response) => {
  const blog = await blogService.getAdminBlogById(req.params.id as string);
  return success(res, blog);
});

export const preview = asyncHandler(async (req: Request, res: Response) => {
  const blog = await blogService.getAdminBlogPreview(req.params.id as string);
  return success(res, blog);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const blog = await blogService.createBlog(req.user!.id, req.body);
  return success(res, blog, 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const blog = await blogService.updateBlog(
    req.params.id as string,
    req.body,
    req.user?.id,
  );
  return success(res, blog);
});

export const revisions = asyncHandler(async (req: Request, res: Response) => {
  const rows = await blogService.listRevisions(req.params.id as string);
  return success(res, rows);
});

export const suggestRelated = asyncHandler(async (req: Request, res: Response) => {
  const rows = await blogService.suggestRelated(req.params.id as string);
  return success(res, rows);
});

export const linkSearch = asyncHandler(async (req: Request, res: Response) => {
  const q = typeof req.query.q === "string" ? req.query.q : "";
  const result = await blogService.searchLinkTargets(q);
  return success(res, result);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const result = await blogService.deleteBlog(req.params.id as string);
  return success(res, result);
});

export const publish = asyncHandler(async (req: Request, res: Response) => {
  const blog = await blogService.publishBlog(req.params.id as string);
  return success(res, blog);
});

export const unpublish = asyncHandler(async (req: Request, res: Response) => {
  const blog = await blogService.unpublishBlog(req.params.id as string);
  return success(res, blog);
});

export const schedule = asyncHandler(async (req: Request, res: Response) => {
  const blog = await blogService.scheduleBlog(
    req.params.id as string,
    new Date(req.body.scheduledAt),
  );
  return success(res, blog);
});

export const authors = asyncHandler(async (_req: Request, res: Response) => {
  const rows = await blogService.listAuthors();
  return success(res, rows);
});

export const dashboard = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await blogService.getDashboardStats();
  return success(res, stats);
});
