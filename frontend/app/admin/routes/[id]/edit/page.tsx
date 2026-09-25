import { EditRouteClient } from "@/components/admin/edit-route-client";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ id: "edit" }];
}

export default async function EditRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditRouteClient id={id} />;
}
