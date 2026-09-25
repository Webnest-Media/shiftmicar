import { LegalDocumentPage } from "@/app/(pages)/legal/components/legal-document-page";
import { privacyPolicy } from "@/lib/legal-content";

export function PrivacyPolicyPage() {
  return <LegalDocumentPage document={privacyPolicy} />;
}
