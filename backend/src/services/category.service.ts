import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";
import { slugify } from "../utils/slug.js";

async function uniqueCategorySlug(base: string, excludeId?: string) {
  let candidate = slugify(base) || "category";
  let suffix = 0;

  while (true) {
    const existing = await prisma.category.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === excludeId) return candidate;
    suffix += 1;
    candidate = `${slugify(base) || "category"}-${suffix}`;
  }
}

export async function listCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { blogs: true } } },
  });
}

export async function getCategoryBySlug(slug: string) {
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) throw new AppError("Category not found", 404);
  return category;
}

export async function createCategory(input: {
  name: string;
  slug?: string;
  description?: string | null;
}) {
  const slug = await uniqueCategorySlug(input.slug || input.name);
  return prisma.category.create({
    data: {
      name: input.name,
      slug,
      description: input.description ?? null,
    },
  });
}

export async function updateCategory(
  id: string,
  input: { name?: string; slug?: string; description?: string | null },
) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new AppError("Category not found", 404);

  const slug =
    input.slug !== undefined || input.name !== undefined
      ? await uniqueCategorySlug(input.slug || input.name || existing.name, id)
      : undefined;

  return prisma.category.update({
    where: { id },
    data: {
      name: input.name,
      slug,
      description: input.description === undefined ? undefined : input.description,
    },
  });
}

export async function deleteCategory(id: string) {
  const existing = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { blogs: true } } },
  });
  if (!existing) throw new AppError("Category not found", 404);

  if (existing._count.blogs > 0) {
    throw new AppError("Cannot delete a category that has blog posts", 409);
  }

  await prisma.category.delete({ where: { id } });
  return { id };
}
