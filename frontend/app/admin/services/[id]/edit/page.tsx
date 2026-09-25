import { EditServiceClient } from "@/components/admin/edit-service-client";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ id: "edit" }];
}

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditServiceClient id={id} />;
}
