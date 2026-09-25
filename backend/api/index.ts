import type { Request, Response } from "express";

let app: any = null;
let initError: Error | null = null;

try {
  const { createApp } = await import("../src/app.js");
  app = createApp();
} catch (error) {
  initError = error instanceof Error ? error : new Error(String(error));
  console.error("Failed to initialize ShiftMyCar Express app on Vercel:", initError);
}

export default function handler(req: Request, res: Response) {
  if (initError || !app) {
    return res.status(500).json({
      success: false,
      error: "FUNCTION_INITIALIZATION_FAILED",
      message: initError?.message || "Failed to start Express application on Vercel",
      hint: "Make sure DATABASE_URL and JWT_SECRET are set in Vercel Project Settings > Environment Variables.",
    });
  }
  return app(req, res);
}
