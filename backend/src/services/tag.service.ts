import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";
import { slugify } from "../utils/slug.js";

async function uniqueTagSlug(base: string, excludeId?: string) {
  let candidate = slugify(base) || "tag";
  let suffix = 0;

  while (true) {
    const existing = await prisma.tag.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === excludeId) return candidate;
    suffix += 1;
    candidate = `${slugify(base) || "tag"}-${suffix}`;
  }
}

export async function listTags() {
  return prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { blogs: true } } },
  });
}

export async function createTag(input: { name: string; slug?: string }) {
  const slug = await uniqueTagSlug(input.slug || input.name);
  return prisma.tag.create({
    data: {
      name: input.name,
      slug,
    },
  });
}

export async function updateTag(
  id: string,
  input: { name?: string; slug?: string },
) {
  const existing = await prisma.tag.findUnique({ where: { id } });
  if (!existing) throw new AppError("Tag not found", 404);

  const slug =
    input.slug !== undefined || input.name !== undefined
      ? await uniqueTagSlug(input.slug || input.name || existing.name, id)
      : undefined;

  return prisma.tag.update({
    where: { id },
    data: {
      name: input.name,
      slug,
    },
  });
}

export async function deleteTag(id: string) {
  const existing = await prisma.tag.findUnique({ where: { id } });
  if (!existing) throw new AppError("Tag not found", 404);

  await prisma.tag.delete({ where: { id } });
  return { id };
}
