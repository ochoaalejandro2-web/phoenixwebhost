"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth";
import {
  applyPaymentFailed,
  applyPaymentSucceeded,
  applyUnpaidPolicy,
  markReminder,
} from "@/lib/billing";
import { createCheckoutForClient } from "@/lib/checkout";
import { monthKey, uniqueSlug } from "@/lib/slug";
import {
  getClient,
  getLead,
  listClients,
  resetToSeed,
  setReviewStatus,
  upsertClient,
} from "@/lib/store";
import { TEMPLATES } from "@/lib/config";
import { isTaxOfficeTemplate } from "@/lib/client-themes";
import type { Client, ReviewStatus, SiteStatus, TemplateId } from "@/lib/types";
import { upsertTaxStaffUser, taxPortalDbReady } from "@/lib/tax-db";

function parseTemplateId(value: string): TemplateId {
  return TEMPLATES.some((tpl) => tpl.id === value)
    ? (value as TemplateId)
    : "contractor";
}

function revalidateClient(client: Client) {
  revalidatePath("/admin");
  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${client.id}`);
  revalidatePath(`/s/${client.slug}`);
}

export async function createClientAction(formData: FormData) {
  await requireOwner();
  const businessName = String(formData.get("businessName") || "").trim();
  if (!businessName) throw new Error("Business name is required");
  const taken = (await listClients()).map((c) => c.slug);
  const client: Client = {
    id: `cli_${crypto.randomUUID()}`,
    businessName,
    slug: uniqueSlug(String(formData.get("slug") || businessName), taken),
    contactName: String(formData.get("contactName") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    address: String(formData.get("address") || "").trim(),
    city: String(formData.get("city") || "Arizona").trim(),
    hours: String(formData.get("hours") || "").trim(),
    tagline: String(formData.get("tagline") || businessName).trim(),
    about: String(formData.get("about") || "").trim(),
    services: String(formData.get("services") || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    template: parseTemplateId(String(formData.get("template") || "contractor")),
    customDomain: String(formData.get("customDomain") || "").trim() || null,
    siteStatus: "live",
    paymentStatus: "unpaid",
    lastPaymentAt: null,
    nextInvoiceAt: null,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    stripeBoostSubscriptionId: null,
    localBoost: false,
    stripeEmailSubscriptionId: null,
    businessEmail: false,
    reminderSentAt: null,
    overdueSince: null,
    offlineAt: null,
    filesKeptUntil: null,
    takenDownAt: null,
    notes: [],
    editRequests: [],
    createdAt: new Date().toISOString(),
  };
  await upsertClient(client);
  if (isTaxOfficeTemplate(client.template)) {
    await maybeSetTaxStaff(client, formData);
  }
  revalidateClient(client);
  redirect(`/admin/clients/${client.id}`);
}

async function maybeSetTaxStaff(client: Client, formData: FormData) {
  const password = String(formData.get("taxStaffPassword") || "");
  if (password.length < 8) return;
  if (!taxPortalDbReady()) return;
  const email = String(formData.get("taxStaffEmail") || client.email || "")
    .trim()
    .toLowerCase();
  if (!email) return;
  await upsertTaxStaffUser({
    clientId: client.id,
    email,
    password,
    name: client.contactName || client.businessName,
    phone: client.phone,
  });
}

export async function createClientFromLeadAction(formData: FormData) {
  await requireOwner();
  const lead = await getLead(String(formData.get("leadId") || ""));
  if (!lead) throw new Error("Lead not found");
  const taken = (await listClients()).map((c) => c.slug);
  const client: Client = {
    id: `cli_${crypto.randomUUID()}`,
    businessName: lead.businessName,
    slug: uniqueSlug(lead.businessName, taken),
    contactName: lead.name,
    email: lead.email,
    phone: lead.phone,
    address: "",
    city: lead.city || "Arizona",
    hours: "",
    tagline: lead.businessName,
    about: lead.message || `${lead.businessName} is a local Arizona business.`,
    services: [],
    template: "professional",
    customDomain: null,
    siteStatus: "live",
    paymentStatus: "unpaid",
    lastPaymentAt: null,
    nextInvoiceAt: null,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    stripeBoostSubscriptionId: null,
    localBoost: false,
    stripeEmailSubscriptionId: null,
    businessEmail: false,
    reminderSentAt: null,
    overdueSince: null,
    offlineAt: null,
    filesKeptUntil: null,
    takenDownAt: null,
    notes: [
      {
        id: `note_${crypto.randomUUID()}`,
        body: `Created from request form (${lead.locale})${
          lead.wantsLocalBoost ? ". Asked for optional Local Boost." : ""
        }${
          lead.wantsBusinessEmail ? ". Asked for optional Business Email." : ""
        }.`,
        createdAt: new Date().toISOString(),
      },
    ],
    editRequests: [],
    createdAt: new Date().toISOString(),
  };
  await upsertClient(client);
  revalidateClient(client);
  redirect(`/admin/clients/${client.id}`);
}

export async function addNoteAction(formData: FormData) {
  await requireOwner();
  const client = await getClient(String(formData.get("clientId") || ""));
  if (!client) throw new Error("Client not found");
  const body = String(formData.get("body") || "").trim();
  if (!body) return;
  await upsertClient({
    ...client,
    notes: [
      {
        id: `note_${crypto.randomUUID()}`,
        body,
        createdAt: new Date().toISOString(),
      },
      ...client.notes,
    ],
  });
  revalidateClient(client);
}

export async function addEditRequestAction(formData: FormData) {
  await requireOwner();
  const client = await getClient(String(formData.get("clientId") || ""));
  if (!client) throw new Error("Client not found");
  const body = String(formData.get("body") || "").trim();
  const minutes = Number(formData.get("minutes") || 15);
  if (!body) return;
  await upsertClient({
    ...client,
    editRequests: [
      {
        id: `ed_${crypto.randomUUID()}`,
        month: monthKey(),
        body,
        minutes: Number.isFinite(minutes) ? minutes : 15,
        status: "open",
        createdAt: new Date().toISOString(),
      },
      ...client.editRequests,
    ],
  });
  revalidateClient(client);
}

export async function finishEditRequestAction(formData: FormData) {
  await requireOwner();
  const client = await getClient(String(formData.get("clientId") || ""));
  const editId = String(formData.get("editId") || "");
  if (!client) return;
  await upsertClient({
    ...client,
    editRequests: client.editRequests.map((row) =>
      row.id === editId ? { ...row, status: "done" } : row,
    ),
  });
  revalidateClient(client);
}

export async function setSiteStatusAction(formData: FormData) {
  await requireOwner();
  const client = await getClient(String(formData.get("clientId") || ""));
  if (!client) return;
  const status = String(formData.get("siteStatus") || "") as SiteStatus;
  if (!["live", "paused", "offline", "taken_down"].includes(status)) return;
  const next: Client = {
    ...client,
    siteStatus: status,
    offlineAt:
      status === "offline" ? client.offlineAt || new Date().toISOString() : client.offlineAt,
  };
  await upsertClient(next);
  revalidateClient(next);
}

export async function markPaidAction(formData: FormData) {
  await requireOwner();
  const client = await getClient(String(formData.get("clientId") || ""));
  if (!client) return;
  const next = applyPaymentSucceeded(client);
  await upsertClient(next);
  revalidateClient(next);
}

export async function markUnpaidAction(formData: FormData) {
  await requireOwner();
  const client = await getClient(String(formData.get("clientId") || ""));
  if (!client) return;
  const next = applyPaymentFailed(client);
  await upsertClient(next);
  revalidateClient(next);
}

export async function sendReminderAction(formData: FormData) {
  await requireOwner();
  const client = await getClient(String(formData.get("clientId") || ""));
  if (!client) return;
  const next = markReminder(client);
  await upsertClient(next);
  revalidateClient(next);
}

export async function runPolicyAction(formData: FormData) {
  await requireOwner();
  const client = await getClient(String(formData.get("clientId") || ""));
  if (!client) return;
  const next = applyUnpaidPolicy(client);
  await upsertClient(next);
  revalidateClient(next);
}

export async function saveClientAction(formData: FormData) {
  await requireOwner();
  const client = await getClient(String(formData.get("clientId") || ""));
  if (!client) return;
  const next: Client = {
    ...client,
    contactName: String(formData.get("contactName") || client.contactName),
    email: String(formData.get("email") || client.email),
    phone: String(formData.get("phone") || client.phone),
    address: String(formData.get("address") || client.address),
    city: String(formData.get("city") || client.city),
    hours: String(formData.get("hours") || client.hours),
    tagline: String(formData.get("tagline") || client.tagline),
    about: String(formData.get("about") || client.about),
    customDomain: String(formData.get("customDomain") || "").trim() || null,
    stripeCustomerId: String(formData.get("stripeCustomerId") || "").trim() || null,
    stripeSubscriptionId:
      String(formData.get("stripeSubscriptionId") || "").trim() || null,
    stripeBoostSubscriptionId:
      String(formData.get("stripeBoostSubscriptionId") || "").trim() || null,
    stripeEmailSubscriptionId:
      String(formData.get("stripeEmailSubscriptionId") || "").trim() || null,
  };
  await upsertClient(next);
  if (isTaxOfficeTemplate(next.template)) {
    await maybeSetTaxStaff(next, formData);
  }
  revalidateClient(next);
}

export async function resetDemoAction() {
  await requireOwner();
  await resetToSeed();
  revalidatePath("/admin");
  revalidatePath("/admin/clients");
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  revalidatePath("/es");
  revalidatePath("/reviews");
  revalidatePath("/es/reviews");
  revalidatePath("/s/desert-peak-roofing");
  revalidatePath("/s/casa-luna-salon");
  revalidatePath("/s/mesa-street-kitchen");
  revalidatePath("/s/palo-verde-yards");
  revalidatePath("/s/hola-tax-service");
  redirect("/admin");
}

function revalidateReviews() {
  revalidatePath("/admin");
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  revalidatePath("/es");
  revalidatePath("/reviews");
  revalidatePath("/es/reviews");
}

export async function setReviewStatusAction(formData: FormData) {
  await requireOwner();
  const id = String(formData.get("reviewId") || "");
  const status = String(formData.get("status") || "") as ReviewStatus;
  if (!["approved", "rejected", "pending"].includes(status)) return;
  await setReviewStatus(id, status);
  revalidateReviews();
}

export async function checkoutClientAction(formData: FormData) {
  await requireOwner();
  const client = await getClient(String(formData.get("clientId") || ""));
  if (!client) throw new Error("Client not found");
  const includeBoost = String(formData.get("includeBoost") || "") === "on";
  const includeEmail = String(formData.get("includeEmail") || "") === "on";
  const boostOnly = String(formData.get("kind") || "") === "boost";
  const emailOnly = String(formData.get("kind") || "") === "email";
  const url = await createCheckoutForClient(client, {
    includeBoost: includeBoost || boostOnly,
    includeEmail: includeEmail || emailOnly,
    boostOnly,
    emailOnly,
  });
  redirect(url);
}
