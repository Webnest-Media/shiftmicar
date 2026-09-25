import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1).optional(),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default("7d"),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  API_URL: z.string().url().default("http://localhost:4000"),
  UPLOAD_DIR: z.string().default("uploads"),
  MAX_UPLOAD_BYTES: z.coerce.number().default(5_242_880),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables. Check backend/.env");
}

function stripTrailingSlash(url: string) {
  return url.replace(/\/+$/, "");
}

export const env = {
  ...parsed.data,
  FRONTEND_URL: stripTrailingSlash(parsed.data.FRONTEND_URL),
  API_URL: stripTrailingSlash(parsed.data.API_URL),
  DIRECT_URL: parsed.data.DIRECT_URL || parsed.data.DATABASE_URL,
};
