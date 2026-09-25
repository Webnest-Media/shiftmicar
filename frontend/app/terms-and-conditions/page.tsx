import type { Metadata } from "next";
import { TermsPage } from "@/app/(pages)/legal/terms-page";

export const metadata: Metadata = {
  title: "Terms & Conditions | Shift My Car",
  description:
    "Read the terms and conditions governing your use of Shift My Car website and premium vehicle transportation services.",
};

export default function Page() {
  return <TermsPage />;
}
