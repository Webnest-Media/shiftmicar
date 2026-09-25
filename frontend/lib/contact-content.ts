export const contactInfo = {
  email: "info@shiftmycar.com",
  phone: "+1 123 456 7890",
  phoneHref: "tel:+11234567890",
  address: {
    line1: "2840 Auto Transport Way",
    line2: "Suite 400",
    city: "Los Angeles, CA 90017",
    country: "United States",
  },
  directionsUrl:
    "https://www.google.com/maps/search/?api=1&query=2840+Auto+Transport+Way+Los+Angeles+CA",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d423286.27405770523!2d-118.69192047471653!3d34.0201613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fdf6f254608f4!2sLos%20Angeles%2C%20CA!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus",
  hours: [
    { days: "Monday – Friday", time: "8:00 AM – 6:00 PM" },
    { days: "Saturday", time: "9:00 AM – 2:00 PM" },
    { days: "Sunday", time: "Closed" },
  ],
  social: [
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "YouTube", href: "#" },
  ],
} as const;

export const quoteChecklist = [
  "Pickup and delivery locations",
  "Vehicle make, model, and year",
  "Preferred service — dedicated, shared, or door-to-door",
  "Your ideal pickup or delivery window",
] as const;

export const contactHighlights = [
  {
    number: "01.",
    title: "Fast Response",
    description:
      "Our team reviews every inquiry and responds within one business day.",
  },
  {
    number: "02.",
    title: "Nationwide Coverage",
    description:
      "Dedicated carriers, shared transport, and door-to-door delivery — all handled with professional care.",
  },
  {
    number: "03.",
    title: "Dedicated Support",
    description:
      "From quote to delivery, a specialist guides you through every step.",
  },
] as const;

export const contactCopy = {
  hero:
    "Have questions about car shifting routes, transit timelines, or custom carrier requirements? Our dedicated logistics team is here to assist you at every step.",
  locationIntro:
    "Visit our regional coordination facilities or connect directly with our dispatch supervisors for shipment status and regional inquiries.",
  readyDescription:
    "Lock in your vehicle shipment with India's premier car transport service. Enjoy guaranteed pickup slots, digital condition tracking, and transparent rates.",
  formSubtext:
    "Provide a few details about your vehicle and destination, and our relocation team will furnish an accurate, obligation-free quote within hours.",
} as const;
