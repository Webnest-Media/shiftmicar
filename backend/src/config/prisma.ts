import { PrismaClient } from "@prisma/client";

/**
 * Supabase's transaction pooler (port 6543) rejects Prisma unless
 * pgbouncer=true and a single connection are set. Vercel env values
 * often omit those, which surfaces as a generic 500 on login.
 */
function normalizeDatabaseUrl(raw: string | undefined): string | undefined {
  if (!raw?.trim()) return raw;
  try {
    const url = new URL(raw);
    const pooled = url.port === "6543" || url.hostname.includes("pooler.supabase.com");
    if (pooled) {
      url.searchParams.set("pgbouncer", "true");
      url.searchParams.set("connection_limit", "1");
    }
    if (!url.searchParams.has("sslmode")) {
      url.searchParams.set("sslmode", "require");
    }
    return url.toString();
  } catch {
    return raw;
  }
}

const databaseUrl = normalizeDatabaseUrl(process.env.DATABASE_URL);
if (databaseUrl) process.env.DATABASE_URL = databaseUrl;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

globalForPrisma.prisma = prisma;
