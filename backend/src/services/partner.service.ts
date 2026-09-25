import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";

export type PartnerInput = {
  name: string;
  logo: string;
  alt?: string | null;
  order?: number;
  isActive?: boolean;
  widthDesktop?: number | null;
  heightDesktop?: number | null;
  widthMobile?: number | null;
  heightMobile?: number | null;
};

export async function listAdminPartners() {
  return (prisma as any).partner.findMany({
    orderBy: [
      { order: "asc" },
      { createdAt: "asc" },
    ],
  });
}

export async function listPublicPartners() {
  return (prisma as any).partner.findMany({
    where: { isActive: true },
    orderBy: [
      { order: "asc" },
      { createdAt: "asc" },
    ],
  });
}

export async function getPartnerById(id: string) {
  const item = await (prisma as any).partner.findUnique({
    where: { id },
  });
  if (!item) {
    throw new AppError("Partner logo not found", 404);
  }
  return item;
}

export async function createPartner(input: PartnerInput) {
  return (prisma as any).partner.create({
    data: {
      name: input.name.trim(),
      logo: input.logo.trim(),
      alt: input.alt?.trim() || null,
      order: input.order !== undefined ? Number(input.order) : 0,
      isActive: input.isActive !== undefined ? Boolean(input.isActive) : true,
      widthDesktop: input.widthDesktop !== undefined && input.widthDesktop !== null ? Number(input.widthDesktop) : 140,
      heightDesktop: input.heightDesktop !== undefined && input.heightDesktop !== null ? Number(input.heightDesktop) : 40,
      widthMobile: input.widthMobile !== undefined && input.widthMobile !== null ? Number(input.widthMobile) : 100,
      heightMobile: input.heightMobile !== undefined && input.heightMobile !== null ? Number(input.heightMobile) : 28,
    },
  });
}

export async function updatePartner(
  id: string,
  input: Partial<PartnerInput>,
) {
  const existing = await (prisma as any).partner.findUnique({
    where: { id },
  });
  if (!existing) {
    throw new AppError("Partner logo not found", 404);
  }

  return (prisma as any).partner.update({
    where: { id },
    data: {
      ...(input.name !== undefined && { name: input.name.trim() }),
      ...(input.logo !== undefined && { logo: input.logo.trim() }),
      ...(input.alt !== undefined && { alt: input.alt?.trim() || null }),
      ...(input.order !== undefined && { order: Number(input.order) }),
      ...(input.isActive !== undefined && { isActive: Boolean(input.isActive) }),
      ...(input.widthDesktop !== undefined && { widthDesktop: input.widthDesktop !== null ? Number(input.widthDesktop) : null }),
      ...(input.heightDesktop !== undefined && { heightDesktop: input.heightDesktop !== null ? Number(input.heightDesktop) : null }),
      ...(input.widthMobile !== undefined && { widthMobile: input.widthMobile !== null ? Number(input.widthMobile) : null }),
      ...(input.heightMobile !== undefined && { heightMobile: input.heightMobile !== null ? Number(input.heightMobile) : null }),
    },
  });
}

export async function deletePartner(id: string) {
  const existing = await (prisma as any).partner.findUnique({
    where: { id },
  });
  if (!existing) {
    throw new AppError("Partner logo not found", 404);
  }

  await (prisma as any).partner.delete({
    where: { id },
  });

  return { id };
}
