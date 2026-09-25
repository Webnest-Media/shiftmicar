import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const email = "admin@shiftmycar.com";
const password = "ChangeMe123!";
const prisma = new PrismaClient();

try {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log("missing-user");
    process.exitCode = 1;
  } else {
    const matches = await bcrypt.compare(password, user.passwordHash);
    console.log("password-matches", matches);
    if (!matches) {
      const passwordHash = await bcrypt.hash(password, 12);
      await prisma.user.update({
        where: { email },
        data: { passwordHash, role: "ADMIN", name: user.name || "Admin" },
      });
      console.log("password-reset", true);
    }
  }
} catch (error) {
  console.log("ERR_NAME", error?.name);
  console.log("ERR_CODE", error?.code);
  console.log("ERR_MSG", String(error?.message || error).slice(0, 400));
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
