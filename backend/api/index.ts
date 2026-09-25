import type { Request, Response } from "express";
import { createApp } from "../src/app.js";
import { env } from "../src/config/env.js";
import { ensureAdminUser } from "../src/services/auth.service.js";

let app: any = null;
let initError: Error | null = null;
let adminReady: Promise<void> | null = null;

try {
  app = createApp();
} catch (error) {
  initError = error instanceof Error ? error : new Error(String(error));
  console.error("Failed to initialize ShiftMyCar Express app on Vercel:", initError);
}

function ensureAdmin() {
  if (!env.IS_DB_CONFIGURED || !env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    return Promise.resolve();
  }
  if (!adminReady) {
    adminReady = ensureAdminUser({
      name: "Admin",
      email: env.ADMIN_EMAIL,
      password: env.ADMIN_PASSWORD,
    })
      .then(() => undefined)
      .catch((error) => {
        adminReady = null;
        console.error("Admin bootstrap failed", error);
      });
  }
  return adminReady;
}

export default async function handler(req: Request, res: Response) {
  if (initError || !app) {
    return res.status(500).json({
      success: false,
      error: "FUNCTION_INITIALIZATION_FAILED",
      message: initError?.message || "Failed to start Express application on Vercel",
      hint: "Make sure DATABASE_URL and JWT_SECRET are set in Vercel Project Settings > Environment Variables.",
    });
  }

  // Restore the original URL when Vercel rewrites to /api/index.js
  const matched = (req.headers["x-matched-path"] as string) || (req as any).originalUrl;
  if (matched && req.url && (req.url.startsWith("/api/index") || req.url === "/api")) {
    req.url = matched;
  }

  // Password check is slow (bcrypt) and only needed for sign-in.
  // Do not block public pages on it.
  const path = req.url || "";
  if (path.includes("/api/auth/login")) {
    await ensureAdmin();
  }
  return app(req, res);
}
