import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";
import { hashPassword, signToken, verifyPassword } from "../utils/auth.js";
import { serializeUser } from "../utils/serializers.js";
import { env } from "../config/env.js";

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: serializeUser(user),
    expiresIn: env.JWT_EXPIRES_IN,
  };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, bio: true, avatarUrl: true },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return serializeUser(user);
}

export async function updateMe(
  userId: string,
  input: { name?: string; bio?: string | null; avatarUrl?: string | null },
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name: input.name,
      bio: input.bio,
      avatarUrl: input.avatarUrl,
    },
    select: { id: true, name: true, email: true, role: true, bio: true, avatarUrl: true },
  });

  return serializeUser(user);
}

export async function ensureAdminUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  const email = input.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    const valid = await verifyPassword(input.password, existing.passwordHash);
    if (valid && existing.role === "ADMIN" && existing.name === input.name) {
      return existing;
    }
    return prisma.user.update({
      where: { email },
      data: {
        name: input.name,
        role: "ADMIN",
        passwordHash: valid ? existing.passwordHash : await hashPassword(input.password),
      },
    });
  }

  return prisma.user.create({
    data: {
      name: input.name,
      email,
      passwordHash: await hashPassword(input.password),
      role: "ADMIN",
    },
  });
}
