-- AlterEnum
DO $$ BEGIN
  CREATE TYPE "SeoHealth" AS ENUM ('GOOD', 'NEEDS_ATTENTION', 'INCOMPLETE');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- AlterTable users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "bio" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;

-- AlterTable media
ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "alt" TEXT;

-- AlterTable blog_posts
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "contentJson" JSONB;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "featuredImageAlt" TEXT;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "focusKeyword" TEXT;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "secondaryKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "robotsIndex" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "robotsFollow" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "twitterTitle" TEXT;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "twitterDescription" TEXT;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "twitterImage" TEXT;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "faqItems" JSONB;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "seoHealth" "SeoHealth" NOT NULL DEFAULT 'INCOMPLETE';

CREATE INDEX IF NOT EXISTS "blog_posts_seoHealth_idx" ON "blog_posts"("seoHealth");
CREATE INDEX IF NOT EXISTS "blog_posts_authorId_idx" ON "blog_posts"("authorId");

-- CreateTable
CREATE TABLE IF NOT EXISTS "blog_relations" (
    "fromBlogId" TEXT NOT NULL,
    "toBlogId" TEXT NOT NULL,

    CONSTRAINT "blog_relations_pkey" PRIMARY KEY ("fromBlogId","toBlogId")
);

CREATE INDEX IF NOT EXISTS "blog_relations_toBlogId_idx" ON "blog_relations"("toBlogId");

ALTER TABLE "blog_relations" DROP CONSTRAINT IF EXISTS "blog_relations_fromBlogId_fkey";
ALTER TABLE "blog_relations" ADD CONSTRAINT "blog_relations_fromBlogId_fkey" FOREIGN KEY ("fromBlogId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "blog_relations" DROP CONSTRAINT IF EXISTS "blog_relations_toBlogId_fkey";
ALTER TABLE "blog_relations" ADD CONSTRAINT "blog_relations_toBlogId_fkey" FOREIGN KEY ("toBlogId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE IF NOT EXISTS "blog_revisions" (
    "id" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "editorId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "contentJson" JSONB,
    "seoSnapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_revisions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "blog_revisions_blogId_createdAt_idx" ON "blog_revisions"("blogId", "createdAt");

ALTER TABLE "blog_revisions" DROP CONSTRAINT IF EXISTS "blog_revisions_blogId_fkey";
ALTER TABLE "blog_revisions" ADD CONSTRAINT "blog_revisions_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "blog_revisions" DROP CONSTRAINT IF EXISTS "blog_revisions_editorId_fkey";
ALTER TABLE "blog_revisions" ADD CONSTRAINT "blog_revisions_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE IF NOT EXISTS "redirects" (
    "id" TEXT NOT NULL,
    "fromPath" TEXT NOT NULL,
    "toPath" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL DEFAULT 301,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "redirects_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "redirects_fromPath_key" ON "redirects"("fromPath");
CREATE INDEX IF NOT EXISTS "redirects_fromPath_idx" ON "redirects"("fromPath");
