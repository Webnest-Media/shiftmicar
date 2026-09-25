import type { Request, Response } from "express";
import { env } from "../config/env.js";
import * as authService from "../services/auth.service.js";
import { success } from "../utils/api-response.js";
import { asyncHandler } from "../middleware/error-handler.js";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body.email, req.body.password);

  res.cookie("token", result.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return success(res, result);
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("token");
  return success(res, { message: "Logged out" });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getMe(req.user!.id);
  return success(res, user);
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.updateMe(req.user!.id, req.body);
  return success(res, user);
});
