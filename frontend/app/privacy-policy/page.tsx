import type { Metadata } from "next";
import { PrivacyPolicyPage } from "@/app/(pages)/legal/privacy-policy-page";

export const metadata: Metadata = {
  title: "Privacy Policy | Shift My Car",
  description:
    "Learn how Shift My Car collects, uses, and protects your personal information when you use our vehicle transportation services.",
};

export default function Page() {
  return <PrivacyPolicyPage />;
}
