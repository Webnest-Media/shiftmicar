import { PreviewBlogClient } from "@/components/admin/preview-blog-client";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ id: "preview" }];
}

export default async function PreviewBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PreviewBlogClient id={id} />;
}
