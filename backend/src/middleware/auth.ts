import type { NextFunction, Request, Response } from "express";
import type { Role } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { fail } from "../utils/api-response.js";
import { verifyToken } from "../utils/auth.js";
import type { AuthUser } from "../types/express.js";

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    return header.slice(7);
  }

  const cookieToken = req.cookies?.token;
  if (typeof cookieToken === "string" && cookieToken.length > 0) {
    return cookieToken;
  }

  return null;
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = extractToken(req);
    if (!token) {
      return fail(res, "Authentication required", 401);
    }

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return fail(res, "Authentication required", 401);
    }

    req.user = user as AuthUser;
    next();
  } catch {
    return fail(res, "Invalid or expired token", 401);
  }
}

export function authorize(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return fail(res, "Authentication required", 401);
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return fail(res, "Insufficient permissions", 403);
    }

    next();
  };
}
