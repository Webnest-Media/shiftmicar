import { BlogEditor } from "@/components/admin/blog-editor";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ id: "edit" }];
}

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BlogEditor mode="edit" blogId={id} />;
}
