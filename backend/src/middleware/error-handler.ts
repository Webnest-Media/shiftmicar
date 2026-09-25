import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodType } from "zod";
import { fail } from "../utils/api-response.js";
import { AppError } from "../utils/app-error.js";

export function validateBody<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return fail(res, "Validation failed", 422, error.flatten().fieldErrors);
      }
      next(error);
    }
  };
}

export function validateQuery<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.query);
      (req as Request & { validatedQuery: T }).validatedQuery = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return fail(res, "Invalid query parameters", 422, error.flatten().fieldErrors);
      }
      next(error);
    }
  };
}

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return fail(res, err.message, err.statusCode, err.errors);
  }

  if (err instanceof ZodError) {
    return fail(res, "Validation failed", 422, err.flatten().fieldErrors);
  }

  const message = err instanceof Error ? err.message : String(err);
  const name = err instanceof Error ? err.name : "";
  const code =
    typeof err === "object" && err && "code" in err && typeof (err as { code: unknown }).code === "string"
      ? (err as { code: string }).code
      : "";

  const databaseError =
    name.startsWith("PrismaClient") ||
    code.startsWith("P") ||
    message.includes("Can't reach database server") ||
    message.includes("Authentication failed against database") ||
    message.includes("prepared statement") ||
    message.includes("Query Engine") ||
    message.includes("libquery_engine");

  if (databaseError) {
    console.error(err);
    const label = code ? ` (${code})` : "";
    return fail(res, `Database unavailable${label}. Check DATABASE_URL on the server.`, 503);
  }

  console.error(err);
  return fail(res, "Internal server error", 500);
}
