import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/app-error.js";

export async function listMedia() {
  return prisma.media.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createMedia(file: Express.Multer.File) {
  const url = `${env.API_URL}/uploads/${file.filename}`;

  return prisma.media.create({
    data: {
      url,
      filename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    },
  });
}

export async function deleteMedia(id: string) {
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) throw new AppError("Media not found", 404);

  const filename = media.url.split("/").pop();
  if (filename) {
    const filePath = path.resolve(env.UPLOAD_DIR, filename);
    try {
      await fs.unlink(filePath);
    } catch {
      // File may already be missing; continue deleting DB record.
    }
  }

  await prisma.media.delete({ where: { id } });
  return { id };
}
