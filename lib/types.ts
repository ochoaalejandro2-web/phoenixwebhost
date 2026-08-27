export type Locale = "en" | "es";

export type TemplateId =
  | "contractor"
  | "salon"
  | "restaurant"
  | "professional"
  | "landscaping";

export type PaymentStatus = "paid" | "overdue" | "unpaid" | "none";

export type SiteStatus = "live" | "paused" | "offline" | "taken_down";

export type Note = {
  id: string;
  body: string;
  createdAt: string;
};

export type EditRequest = {
  id: string;
  month: string;
  body: string;
  minutes: number;
  status: "open" | "done";
  createdAt: string;
};

export type Client = {
  id: string;
  businessName: string;
  slug: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  hours: string;
  tagline: string;
  about: string;
  services: string[];
  template: TemplateId;
  customDomain: string | null;
  siteStatus: SiteStatus;
  paymentStatus: PaymentStatus;
  lastPaymentAt: string | null;
  nextInvoiceAt: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  reminderSentAt: string | null;
  overdueSince: string | null;
  offlineAt: string | null;
  filesKeptUntil: string | null;
  takenDownAt: string | null;
  notes: Note[];
  editRequests: EditRequest[];
  createdAt: string;
  sample?: boolean;
};

export type Lead = {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  city: string;
  message: string;
  locale: Locale;
  createdAt: string;
};

export type ContactMessage = {
  id: string;
  clientId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
};

export type ReviewStatus = "pending" | "approved" | "rejected";

export type Review = {
  id: string;
  companyName: string;
  reviewerName: string;
  city: string;
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  status: ReviewStatus;
  createdAt: string;
  publishedAt: string | null;
};

export type AuthLock = {
  passwordFails: number;
  passwordLockedUntil: number | null;
  codeFails: number;
  codeLockedUntil: number | null;
  lastCodeSentAt: number | null;
  consumedNonces: string[];
};

export type AppState = {
  clients: Client[];
  leads: Lead[];
  contactMessages: ContactMessage[];
  reviews: Review[];
  authLock: AuthLock;
  seededAt: string;
};
