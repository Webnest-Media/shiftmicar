import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";

export type TestimonialInput = {
  name: string;
  role: string;
  quote: string;
  logo?: string | null;
  rating?: number;
  order?: number;
  isActive?: boolean;
};

export async function listAdminTestimonials() {
  return (prisma as any).testimonial.findMany({
    orderBy: [
      { order: "asc" },
      { createdAt: "desc" },
    ],
  });
}

export async function listPublicTestimonials() {
  return (prisma as any).testimonial.findMany({
    where: { isActive: true },
    orderBy: [
      { order: "asc" },
      { createdAt: "desc" },
    ],
  });
}

export async function getTestimonialById(id: string) {
  const item = await (prisma as any).testimonial.findUnique({
    where: { id },
  });
  if (!item) {
    throw new AppError("Testimonial not found", 404);
  }
  return item;
}

export async function createTestimonial(input: TestimonialInput) {
  return (prisma as any).testimonial.create({
    data: {
      name: input.name,
      role: input.role,
      quote: input.quote,
      logo: input.logo?.trim() || null,
      rating: input.rating !== undefined ? Number(input.rating) : 5,
      order: input.order !== undefined ? Number(input.order) : 0,
      isActive: input.isActive !== undefined ? Boolean(input.isActive) : true,
    },
  });
}

export async function updateTestimonial(
  id: string,
  input: Partial<TestimonialInput>,
) {
  const existing = await (prisma as any).testimonial.findUnique({
    where: { id },
  });
  if (!existing) {
    throw new AppError("Testimonial not found", 404);
  }

  return (prisma as any).testimonial.update({
    where: { id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.role !== undefined && { role: input.role }),
      ...(input.quote !== undefined && { quote: input.quote }),
      ...(input.logo !== undefined && { logo: input.logo?.trim() || null }),
      ...(input.rating !== undefined && { rating: Number(input.rating) }),
      ...(input.order !== undefined && { order: Number(input.order) }),
      ...(input.isActive !== undefined && { isActive: Boolean(input.isActive) }),
    },
  });
}

export async function deleteTestimonial(id: string) {
  const existing = await (prisma as any).testimonial.findUnique({
    where: { id },
  });
  if (!existing) {
    throw new AppError("Testimonial not found", 404);
  }

  await (prisma as any).testimonial.delete({
    where: { id },
  });

  return { id };
}
