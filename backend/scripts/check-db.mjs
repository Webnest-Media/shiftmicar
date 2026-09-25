import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function redact(value) {
  return String(value || "").replace(/postgres(?:ql)?:\/\/\S+/gi, "[redacted]");
}

try {
  const rows = await prisma.$queryRawUnsafe("SELECT current_database() AS db");
  console.log("connected", JSON.stringify(rows));
  const users = await prisma.$queryRawUnsafe("SELECT email, role FROM users");
  console.log("users", JSON.stringify(users));
} catch (error) {
  console.log("ERR_NAME", error?.name);
  console.log("ERR_CODE", error?.code);
  console.log("ERR_MSG", redact(error?.message).slice(0, 800));
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
