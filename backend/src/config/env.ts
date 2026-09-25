import "dotenv/config";
import { z } from "zod";

function normalizeUrl(value: unknown, fallback: string): string {
  if (typeof value !== "string" || !value.trim()) return fallback;
  const trimmed = value.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed.replace(/\/+$/, "");
  }
  return `https://${trimmed}`.replace(/\/+$/, "");
}

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().default(""),
  DIRECT_URL: z.string().optional(),
  JWT_SECRET: z.string().min(16).default("shiftmycar-secure-default-jwt-secret-key-32chars"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  FRONTEND_URL: z.string().default("http://localhost:3000").transform((v) => normalizeUrl(v, "http://localhost:3000")),
  API_URL: z.string().default("http://localhost:4000").transform((v) => normalizeUrl(v, "http://localhost:4000")),
  UPLOAD_DIR: z.string().default("uploads"),
  MAX_UPLOAD_BYTES: z.coerce.number().default(5_242_880),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
}

const data = parsed.success ? parsed.data : envSchema.parse({});

if (!data.DATABASE_URL) {
  console.warn("⚠️ WARNING: DATABASE_URL is not configured in environment variables. Database operations will fail until DATABASE_URL is set in Vercel project settings.");
}

export const env = {
  ...data,
  DIRECT_URL: data.DIRECT_URL || data.DATABASE_URL,
  IS_DB_CONFIGURED: Boolean(data.DATABASE_URL),
};
