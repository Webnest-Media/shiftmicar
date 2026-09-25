"use client";

import { use } from "react";
import { BlogEditor } from "@/components/admin/blog-editor";

export default function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <BlogEditor mode="edit" blogId={id} />;
}
