import { contactInfo } from "@/lib/contact-content";

export type LegalBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: readonly string[] };

export type LegalSection = {
  id: string;
  title: string;
  blocks: readonly LegalBlock[];
};

export type LegalDocument = {
  title: string;
  description: string;
  lastUpdated: string;
  sections: readonly LegalSection[];
};

const companyName = "Shift My Car";
const contactEmail = contactInfo.email;

export const privacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  description:
    "How we collect, use, and protect your personal information when you use our vehicle transportation services and website.",
  lastUpdated: "September 1, 2026",
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      blocks: [
        {
          type: "paragraph",
          text: `${companyName} ("we," "our," or "us") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, request a quote, or use our car transportation services.`,
        },
        {
          type: "paragraph",
          text: "By using our website or services, you agree to the collection and use of information in accordance with this policy. If you do not agree, please do not use our website or services.",
        },
      ],
    },
    {
      id: "information-we-collect",
      title: "Information We Collect",
      blocks: [
        {
          type: "paragraph",
          text: "We may collect the following types of information when you interact with us:",
        },
        {
          type: "list",
          items: [
            "Contact details such as your name, email address, phone number, and mailing address.",
            "Vehicle information including make, model, year, condition, and registration details needed to arrange transport.",
            "Pickup and delivery locations, preferred dates, and service preferences.",
            "Payment and billing information when you book a transport service.",
            "Communications you send us through contact forms, email, or phone.",
            "Technical data such as IP address, browser type, device information, and pages visited on our website.",
          ],
        },
      ],
    },
    {
      id: "how-we-use-information",
      title: "How We Use Your Information",
      blocks: [
        {
          type: "paragraph",
          text: "We use the information we collect for legitimate business purposes, including:",
        },
        {
          type: "list",
          items: [
            "Providing quotes, scheduling pickups, and coordinating vehicle transportation.",
            "Communicating with you about your booking, delivery status, and customer support requests.",
            "Processing payments and maintaining transaction records.",
            "Improving our website, services, and customer experience.",
            "Sending service-related updates, where permitted by law.",
            "Complying with legal obligations and protecting our rights.",
          ],
        },
      ],
    },
    {
      id: "information-sharing",
      title: "How We Share Information",
      blocks: [
        {
          type: "paragraph",
          text: "We do not sell your personal information. We may share your information only in the following circumstances:",
        },
        {
          type: "list",
          items: [
            "With carriers, drivers, and logistics partners involved in fulfilling your transport request.",
            "With payment processors and service providers who assist our operations under confidentiality obligations.",
            "When required by law, regulation, legal process, or governmental request.",
            "To protect the safety, rights, or property of our customers, employees, or company.",
            "In connection with a merger, acquisition, or sale of business assets, with appropriate safeguards.",
          ],
        },
      ],
    },
    {
      id: "cookies",
      title: "Cookies & Analytics",
      blocks: [
        {
          type: "paragraph",
          text: "Our website may use cookies and similar technologies to remember preferences, understand how visitors use the site, and improve performance. You can control cookies through your browser settings, though disabling them may affect certain site features.",
        },
      ],
    },
    {
      id: "data-retention",
      title: "Data Retention",
      blocks: [
        {
          type: "paragraph",
          text: "We retain personal information only for as long as necessary to fulfill the purposes described in this policy, including providing services, resolving disputes, enforcing agreements, and meeting legal or accounting requirements.",
        },
      ],
    },
    {
      id: "your-rights",
      title: "Your Rights & Choices",
      blocks: [
        {
          type: "paragraph",
          text: "Depending on your location, you may have rights to access, correct, delete, or restrict the use of your personal information. You may also opt out of marketing communications at any time by following the unsubscribe instructions in our messages or contacting us directly.",
        },
        {
          type: "paragraph",
          text: `To make a privacy-related request, contact us at ${contactEmail}. We will respond within a reasonable timeframe in accordance with applicable law.`,
        },
      ],
    },
    {
      id: "security",
      title: "Security",
      blocks: [
        {
          type: "paragraph",
          text: "We implement reasonable administrative, technical, and organizational measures designed to protect your information. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.",
        },
      ],
    },
    {
      id: "children",
      title: "Children's Privacy",
      blocks: [
        {
          type: "paragraph",
          text: "Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us so we can take appropriate action.",
        },
      ],
    },
    {
      id: "policy-changes",
      title: "Changes to This Policy",
      blocks: [
        {
          type: "paragraph",
          text: "We may update this Privacy Policy from time to time. When we do, we will revise the \"Last updated\" date at the top of this page. Continued use of our website or services after changes become effective constitutes acceptance of the updated policy.",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact Us",
      blocks: [
        {
          type: "paragraph",
          text: `If you have questions about this Privacy Policy or our data practices, contact ${companyName} at ${contactEmail} or ${contactInfo.phone}.`,
        },
      ],
    },
  ],
};

export const termsAndConditions: LegalDocument = {
  title: "Terms & Conditions",
  description:
    "The terms governing your use of our website and premium vehicle transportation services.",
  lastUpdated: "September 1, 2026",
  sections: [
    {
      id: "agreement",
      title: "Agreement to Terms",
      blocks: [
        {
          type: "paragraph",
          text: `These Terms & Conditions ("Terms") govern your access to and use of the ${companyName} website and transportation services. By requesting a quote, booking a service, or using our website, you agree to be bound by these Terms.`,
        },
        {
          type: "paragraph",
          text: "If you are entering into this agreement on behalf of a business or dealership, you represent that you have authority to bind that entity to these Terms.",
        },
      ],
    },
    {
      id: "services",
      title: "Our Services",
      blocks: [
        {
          type: "paragraph",
          text: `${companyName} provides vehicle transportation services including dedicated car transport, premium shared transport, door-to-door delivery, and express car delivery. Service availability, routes, and timelines may vary based on location, vehicle type, and operational conditions.`,
        },
        {
          type: "paragraph",
          text: "Quotes are estimates based on the information you provide. Final pricing may change if pickup or delivery details, vehicle condition, or service requirements differ from the original request.",
        },
      ],
    },
    {
      id: "bookings",
      title: "Bookings & Scheduling",
      blocks: [
        {
          type: "list",
          items: [
            "A booking is confirmed only after we accept your request and any required deposit or payment terms are agreed.",
            "You are responsible for providing accurate pickup and delivery information, vehicle details, and contact information.",
            "Pickup and delivery windows are estimates and may be affected by weather, traffic, carrier availability, or other factors beyond our control.",
            "You must ensure the vehicle is accessible, operable unless otherwise disclosed, and free of personal belongings not authorized for transport.",
          ],
        },
      ],
    },
    {
      id: "customer-responsibilities",
      title: "Customer Responsibilities",
      blocks: [
        {
          type: "paragraph",
          text: "You agree to:",
        },
        {
          type: "list",
          items: [
            "Provide truthful and complete information about the vehicle and transport requirements.",
            "Ensure the vehicle is legally registered and authorized for transport.",
            "Remove or secure loose items, valuables, and personal property unless expressly agreed in writing.",
            "Disclose any mechanical issues, modifications, or non-standard conditions that may affect loading or transport.",
            "Be available or designate an authorized representative for pickup and delivery handover.",
          ],
        },
      ],
    },
    {
      id: "payment",
      title: "Payment Terms",
      blocks: [
        {
          type: "paragraph",
          text: "Payment terms, deposits, and accepted methods will be communicated at the time of booking. Unless otherwise stated, full payment may be required before release of the vehicle at delivery. Late or failed payments may result in delays, storage fees, or cancellation of service.",
        },
      ],
    },
    {
      id: "cancellation",
      title: "Cancellations & Changes",
      blocks: [
        {
          type: "paragraph",
          text: "If you need to cancel or reschedule, contact us as early as possible. Cancellation fees may apply depending on how close the change is to the scheduled pickup date and whether carrier resources have already been allocated.",
        },
      ],
    },
    {
      id: "liability",
      title: "Liability & Insurance",
      blocks: [
        {
          type: "paragraph",
          text: `${companyName} takes professional care in handling vehicles during transport. Liability for loss or damage is subject to applicable carrier insurance, contractual limitations, and documented condition reports at pickup and delivery.`,
        },
        {
          type: "paragraph",
          text: "You must report any visible damage or discrepancies at the time of delivery. Claims not reported promptly may be more difficult to investigate and resolve.",
        },
        {
          type: "paragraph",
          text: "To the fullest extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from delays, scheduling changes, or events outside our reasonable control.",
        },
      ],
    },
    {
      id: "website-use",
      title: "Website Use",
      blocks: [
        {
          type: "paragraph",
          text: "You may use our website only for lawful purposes. You agree not to misuse the site, attempt unauthorized access, interfere with site functionality, or use automated systems to scrape or harvest content without permission.",
        },
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      blocks: [
        {
          type: "paragraph",
          text: `All content on this website — including text, branding, logos, images, and design — is owned by or licensed to ${companyName} and protected by applicable intellectual property laws. You may not copy, reproduce, or distribute site content without prior written consent.`,
        },
      ],
    },
    {
      id: "governing-law",
      title: "Governing Law",
      blocks: [
        {
          type: "paragraph",
          text: "These Terms are governed by the laws of the State of California, without regard to conflict-of-law principles. Any disputes arising from these Terms or our services shall be resolved in the courts located in Los Angeles County, California, unless otherwise required by applicable law.",
        },
      ],
    },
    {
      id: "terms-changes",
      title: "Changes to These Terms",
      blocks: [
        {
          type: "paragraph",
          text: "We may update these Terms from time to time. The updated version will be posted on this page with a revised \"Last updated\" date. Your continued use of our website or services after changes take effect constitutes acceptance of the revised Terms.",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      blocks: [
        {
          type: "paragraph",
          text: `For questions about these Terms, contact ${companyName} at ${contactEmail} or ${contactInfo.phone}.`,
        },
      ],
    },
  ],
};
