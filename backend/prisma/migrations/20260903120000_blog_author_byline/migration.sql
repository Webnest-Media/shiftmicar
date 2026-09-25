-- AlterTable blog_posts
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "authorName" TEXT;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "authorBio" TEXT;
