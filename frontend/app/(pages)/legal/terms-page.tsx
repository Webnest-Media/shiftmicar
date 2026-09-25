import { LegalDocumentPage } from "@/app/(pages)/legal/components/legal-document-page";
import { termsAndConditions } from "@/lib/legal-content";

export function TermsPage() {
  return <LegalDocumentPage document={termsAndConditions} />;
}
