import { AdminShell } from "@/components/admin/admin-shell";
import "./cms.css";

export const metadata = {
  title: "CMS | Shift My Car",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
