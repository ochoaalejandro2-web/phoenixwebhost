import { promises as fs } from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";
import { createSeedState, mergeMissingSeedClients } from "@/data/seed";
import { applyExtraPriceIdsToEnv } from "@/lib/stripe-extra-prices";
import { findClientByCustomDomain } from "@/lib/custom-domain";
import { pickClientBySlug } from "@/lib/walk-in-hosts";
import { withHolaTaxLlcService } from "@/lib/hola-tax-i18n";
import { HOLA_TAX_SLUG } from "@/lib/tax-office";
import { closerFromName, sanitizeCloserCode } from "@/lib/closers";
import { emptyDemoTweaks, parseDemoAccent, parseTemplateId } from "@/lib/demo";
import type {
  AppState,
  AuthLock,
  Client,
  Closer,
  ContactMessage,
  DemoTweaks,
  Lead,
  Review,
  ReviewStatus,
  SignDocument,
  TemplateId,
} from "@/lib/types";
import {
  SIGN_TTL_MS,
  generateSignCode,
  publicSignStatus,
  signCodeLookupKey,
} from "@/lib/sign";

const FILE_PATH = path.join(process.cwd(), "data", "store.json");
const TMP_PATH = "/tmp/phoenixwebhost-store.json";
const STORE_KEY = "__phoenixwebhost_app_store__";

type StoreBag = {
  memory: AppState | null;
  writeChain: Promise<unknown>;
};

function bag(): StoreBag {
  const g = globalThis as typeof globalThis & {
    [STORE_KEY]?: StoreBag;
  };
  if (!g[STORE_KEY]) {
    g[STORE_KEY] = { memory: null, writeChain: Promise.resolve() };
  }
  return g[STORE_KEY];
}

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const store = bag();
  const run = store.writeChain.then(fn, fn);
  store.writeChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function databaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
}

function filePath() {
  return process.env.VERCEL ? TMP_PATH : FILE_PATH;
}

export function storageMode(): "postgres" | "file" | "memory" {
  if (databaseUrl()) return "postgres";
  if (process.env.VERCEL) return "memory";
  return "file";
}

async function readFileState(): Promise<AppState | null> {
  try {
    const raw = await fs.readFile(filePath(), "utf8");
    return JSON.parse(raw) as AppState;
  } catch {
    return null;
  }
}

async function writeFileState(state: AppState) {
  const target = filePath();
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, JSON.stringify(state, null, 2), "utf8");
}

async function readPostgres(): Promise<AppState | null> {
  const url = databaseUrl();
  if (!url) return null;
  const sql = neon(url);
  await sql`CREATE TABLE IF NOT EXISTS app_state (
    id INTEGER PRIMARY KEY,
    payload JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`;
  const rows = (await sql`SELECT payload FROM app_state WHERE id = 1`) as {
    payload: AppState;
  }[];
  return rows[0]?.payload ?? null;
}

async function writePostgres(state: AppState) {
  const url = databaseUrl();
  if (!url) return;
  const sql = neon(url);
  await sql`CREATE TABLE IF NOT EXISTS app_state (
    id INTEGER PRIMARY KEY,
    payload JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`;
  await sql`INSERT INTO app_state (id, payload, updated_at)
    VALUES (1, ${JSON.stringify(state)}::jsonb, NOW())
    ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()`;
}

function emptyAuthLock(): AuthLock {
  return {
    passwordFails: 0,
    passwordLockedUntil: null,
    codeFails: 0,
    codeLockedUntil: null,
    lastCodeSentAt: null,
    consumedNonces: [],
  };
}

const KNOWN_TEMPLATES: TemplateId[] = [
  "contractor",
  "handyman",
  "carpentry",
  "salon",
  "restaurant",
  "professional",
  "landscaping",
  "tax",
];

function asText(value: unknown) {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return String(value);
}

function normalizeClient(client: Client): Client {
  let template = client.template;
  let services = client.services;
  if (!Array.isArray(services)) services = [];
  if (client.slug === HOLA_TAX_SLUG) {
    template = "tax";
    services = withHolaTaxLlcService(services);
  } else if (!KNOWN_TEMPLATES.includes(template)) {
    template = "professional";
  }
  return {
    ...client,
    businessName: asText(client.businessName),
    slug: asText(client.slug),
    contactName: asText(client.contactName),
    email: asText(client.email),
    phone: asText(client.phone),
    address: asText(client.address),
    city: asText(client.city),
    hours: asText(client.hours),
    tagline: asText(client.tagline),
    about: asText(client.about),
    template,
    services: Array.isArray(services) ? services.map((row) => asText(row)) : [],
    notes: Array.isArray(client.notes) ? client.notes : [],
    editRequests: Array.isArray(client.editRequests) ? client.editRequests : [],
    localBoost: Boolean(client.localBoost),
    stripeBoostSubscriptionId: client.stripeBoostSubscriptionId ?? null,
    trafficAds: Boolean(client.trafficAds),
    stripeTrafficSubscriptionId: client.stripeTrafficSubscriptionId ?? null,
    loudAds: Boolean(client.loudAds),
    stripeLoudSubscriptionId: client.stripeLoudSubscriptionId ?? null,
    businessEmail: Boolean(client.businessEmail),
    stripeEmailSubscriptionId: client.stripeEmailSubscriptionId ?? null,
    bookAJob: Boolean(client.bookAJob),
    stripeBookSubscriptionId: client.stripeBookSubscriptionId ?? null,
    missedCallTextback: Boolean(client.missedCallTextback),
    stripeMissedCallSubscriptionId: client.stripeMissedCallSubscriptionId ?? null,
    reviewTexts: Boolean(client.reviewTexts),
    stripeReviewTextsSubscriptionId: client.stripeReviewTextsSubscriptionId ?? null,
    voiceReceptionist: Boolean(client.voiceReceptionist),
    stripeVoiceSubscriptionId: client.stripeVoiceSubscriptionId ?? null,
    domainRegister: Boolean(client.domainRegister),
    closerCode: client.closerCode || null,
  };
}

function normalizeLead(lead: Lead): Lead {
  const template = parseTemplateId(lead.template) || "professional";
  const demo: DemoTweaks = {
    ...emptyDemoTweaks(),
    ...(lead.demo || emptyDemoTweaks()),
    accent: parseDemoAccent(lead.demo?.accent),
    logoText: String(lead.demo?.logoText || "").trim(),
    extraSentence: String(lead.demo?.extraSentence || "").trim(),
    extraPageTitle: String(lead.demo?.extraPageTitle || "").trim(),
    extraPageBody: String(lead.demo?.extraPageBody || "").trim(),
  };
  return {
    ...lead,
    template,
    wantsLocalBoost: Boolean(lead.wantsLocalBoost),
    wantsTraffic: Boolean(lead.wantsTraffic),
    wantsLoud: Boolean(lead.wantsLoud),
    wantsBusinessEmail: Boolean(lead.wantsBusinessEmail),
    wantsBookAJob: Boolean(lead.wantsBookAJob),
    wantsMissedCall: Boolean(lead.wantsMissedCall),
    wantsReviewTexts: Boolean(lead.wantsReviewTexts),
    wantsVoice: Boolean(lead.wantsVoice),
    wantsDomain: Boolean(lead.wantsDomain),
    closerCode: lead.closerCode || null,
    purchased: Boolean(lead.purchased),
    clientId: lead.clientId ?? null,
    demo,
  };
}

function normalizeSignDocument(doc: SignDocument): SignDocument {
  return {
    id: asText(doc.id),
    code: asText(doc.code).toUpperCase(),
    filename: asText(doc.filename),
    originalPath: asText(doc.originalPath),
    signedPath: doc.signedPath ? asText(doc.signedPath) : null,
    status: doc.status === "signed" ? "signed" : "pending",
    createdAt: asText(doc.createdAt),
    expiresAt: asText(doc.expiresAt),
    signedAt: doc.signedAt ? asText(doc.signedAt) : null,
    signerName: doc.signerName ? asText(doc.signerName) : null,
    acknowledged: Boolean(doc.acknowledged),
    sizeBytes: typeof doc.sizeBytes === "number" ? doc.sizeBytes : 0,
  };
}

function normalizeState(state: AppState): AppState {
  if (!Array.isArray(state.reviews)) state.reviews = [];
  if (!Array.isArray(state.leads)) state.leads = [];
  if (!Array.isArray(state.closers)) state.closers = [];
  if (!Array.isArray(state.contactMessages)) state.contactMessages = [];
  if (!Array.isArray(state.signDocuments)) state.signDocuments = [];
  if (!Array.isArray(state.clients)) state.clients = [];
  if (!state.authLock) state.authLock = emptyAuthLock();
  if (!Array.isArray(state.authLock.consumedNonces)) {
    state.authLock.consumedNonces = [];
  }
  state.clients = state.clients.map(normalizeClient);
  state.leads = state.leads.map(normalizeLead);
  state.signDocuments = state.signDocuments.map(normalizeSignDocument);
  state.contactMessages = state.contactMessages.map((message) => ({
    ...message,
    source: message.source || "contact",
    conversationId: message.conversationId || undefined,
    notifiedAt: message.notifiedAt ?? null,
  }));
  applyExtraPriceIdsToEnv(state.stripeExtraPrices);
  return state;
}

export async function listClosers() {
  const state = await getState();
  return [...(state.closers || [])].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

export async function getCloserByCode(code: string) {
  const clean = sanitizeCloserCode(code);
  if (!clean) return null;
  const state = await getState();
  return (state.closers || []).find((row) => row.code === clean) ?? null;
}

export async function addCloser(input: {
  name: string;
  email: string;
  code?: string;
}): Promise<Closer> {
  const name = input.name.trim();
  if (!name) throw new Error("Name is required");
  const code = sanitizeCloserCode(input.code) || closerFromName(name);
  if (!code) {
    throw new Error("Need a short code (letters, numbers, hyphens).");
  }
  const closer: Closer = {
    id: `closer_${crypto.randomUUID()}`,
    code,
    name,
    email: input.email.trim(),
    createdAt: new Date().toISOString(),
  };
  await updateState((state) => {
    if (!state.closers) state.closers = [];
    if (state.closers.some((row) => row.code === code)) {
      throw new Error("That code is already in use.");
    }
    state.closers.unshift(closer);
  });
  return closer;
}

async function persistIfSeedDemosAdded(state: AppState, added: boolean) {
  if (!added) return state;
  const mode = storageMode();
  if (mode === "postgres") await writePostgres(state);
  if (mode === "file") await writeFileState(state);
  return state;
}

async function loadUnlocked(): Promise<AppState> {
  const mode = storageMode();
  if (mode === "postgres") {
    const existing = await readPostgres();
    if (existing) {
      const { state, added } = mergeMissingSeedClients(normalizeState(existing));
      await persistIfSeedDemosAdded(state, added);
      bag().memory = state;
      return state;
    }
    const seed = createSeedState();
    await writePostgres(seed);
    bag().memory = seed;
    return seed;
  }
  if (mode === "file") {
    const existing = await readFileState();
    if (existing) {
      const { state, added } = mergeMissingSeedClients(normalizeState(existing));
      await persistIfSeedDemosAdded(state, added);
      bag().memory = state;
      return state;
    }
    const seed = createSeedState();
    await writeFileState(seed);
    bag().memory = seed;
    return seed;
  }
  const cached = bag().memory;
  if (cached) {
    const { state } = mergeMissingSeedClients(cached);
    bag().memory = state;
    return state;
  }
  const seed = createSeedState();
  bag().memory = seed;
  return seed;
}

async function saveUnlocked(state: AppState) {
  bag().memory = state;
  const mode = storageMode();
  if (mode === "postgres") await writePostgres(state);
  if (mode === "file") await writeFileState(state);
}

export async function getState(): Promise<AppState> {
  return enqueue(() => loadUnlocked());
}

export async function updateState(
  mutator: (state: AppState) => AppState | void,
): Promise<AppState> {
  return enqueue(async () => {
    const current = structuredClone(await loadUnlocked());
    const next = mutator(current) ?? current;
    await saveUnlocked(next);
    return next;
  });
}

export async function listClients() {
  const state = await getState();
  return [...state.clients].sort((a, b) =>
    a.businessName.localeCompare(b.businessName),
  );
}

export async function getClient(id: string) {
  const state = await getState();
  return state.clients.find((c) => c.id === id) ?? null;
}

export async function getClientBySlug(slug: string) {
  const state = await getState();
  return pickClientBySlug(state.clients, slug);
}

export async function getClientByDomain(host: string) {
  const state = await getState();
  return findClientByCustomDomain(state.clients, host);
}

export async function getClientByStripeCustomer(customerId: string) {
  const state = await getState();
  return (
    state.clients.find((c) => c.stripeCustomerId === customerId) ?? null
  );
}

export async function getClientByStripeSubscription(subscriptionId: string) {
  const state = await getState();
  return (
    state.clients.find(
      (c) =>
        c.stripeSubscriptionId === subscriptionId ||
        c.stripeBoostSubscriptionId === subscriptionId ||
        c.stripeTrafficSubscriptionId === subscriptionId ||
        c.stripeLoudSubscriptionId === subscriptionId ||
        c.stripeEmailSubscriptionId === subscriptionId ||
        c.stripeBookSubscriptionId === subscriptionId ||
        c.stripeMissedCallSubscriptionId === subscriptionId ||
        c.stripeReviewTextsSubscriptionId === subscriptionId ||
        c.stripeVoiceSubscriptionId === subscriptionId,
    ) ?? null
  );
}

export async function upsertClient(client: Client) {
  await updateState((state) => {
    const index = state.clients.findIndex((c) => c.id === client.id);
    if (index >= 0) state.clients[index] = client;
    else state.clients.push(client);
  });
  return client;
}

export async function listLeads() {
  const state = await getState();
  return [...state.leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addLead(lead: Lead) {
  const normalized = normalizeLead(lead);
  await updateState((state) => {
    state.leads.unshift(normalized);
  });
  return normalized;
}

export async function getLead(id: string) {
  const state = await getState();
  return state.leads.find((l) => l.id === id) ?? null;
}

export async function getLeadByClientId(clientId: string) {
  const state = await getState();
  return state.leads.find((l) => l.clientId === clientId) ?? null;
}

export async function updateLead(
  id: string,
  patch: Partial<Omit<Lead, "id" | "createdAt">>,
) {
  const state = await updateState((current) => {
    const index = current.leads.findIndex((l) => l.id === id);
    if (index < 0) return;
    current.leads[index] = normalizeLead({
      ...current.leads[index],
      ...patch,
    });
  });
  return state.leads.find((l) => l.id === id) ?? null;
}

export async function addContactMessage(message: ContactMessage) {
  await updateState((state) => {
    state.contactMessages.unshift(message);
  });
  return message;
}

export async function getContactByConversation(conversationId: string) {
  if (!conversationId.trim()) return null;
  const state = await getState();
  return (
    state.contactMessages.find((row) => row.conversationId === conversationId) ??
    null
  );
}

export async function upsertContactMessage(message: ContactMessage) {
  await updateState((state) => {
    const index = state.contactMessages.findIndex((row) => row.id === message.id);
    if (index >= 0) state.contactMessages[index] = message;
    else state.contactMessages.unshift(message);
  });
  return message;
}

export async function listContactMessages(clientId?: string) {
  const state = await getState();
  return state.contactMessages
    .filter((m) => (clientId ? m.clientId === clientId : true))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addReview(review: Review) {
  await updateState((state) => {
    if (!state.reviews) state.reviews = [];
    state.reviews.unshift(review);
  });
  return review;
}

export async function listReviews() {
  const state = await getState();
  return [...(state.reviews || [])].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (b.status === "pending" && a.status !== "pending") return 1;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export async function listPublicReviews() {
  const state = await getState();
  return (state.reviews || [])
    .filter((review) => review.status === "approved")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getReview(id: string) {
  const state = await getState();
  return (state.reviews || []).find((review) => review.id === id) ?? null;
}

export async function setReviewStatus(id: string, status: ReviewStatus) {
  await updateState((state) => {
    if (!state.reviews) state.reviews = [];
    const index = state.reviews.findIndex((review) => review.id === id);
    if (index < 0) return;
    const current = state.reviews[index];
    state.reviews[index] = {
      ...current,
      status,
      publishedAt:
        status === "approved"
          ? current.publishedAt || new Date().toISOString()
          : null,
    };
  });
  return getReview(id);
}

export async function resetToSeed() {
  const state = createSeedState();
  await enqueue(async () => {
    await saveUnlocked(state);
  });
  return state;
}

export async function getAuthLock(): Promise<AuthLock> {
  const state = await getState();
  return state.authLock || emptyAuthLock();
}

export async function updateAuthLock(
  mutator: (lock: AuthLock) => void,
): Promise<AuthLock> {
  const state = await updateState((current) => {
    if (!current.authLock) current.authLock = emptyAuthLock();
    mutator(current.authLock);
  });
  return state.authLock;
}

export async function listSignDocuments() {
  const state = await getState();
  return [...(state.signDocuments || [])].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export async function getSignDocument(id: string) {
  const state = await getState();
  return (state.signDocuments || []).find((row) => row.id === id) ?? null;
}

export async function getSignDocumentByCode(raw: string) {
  const key = signCodeLookupKey(raw);
  if (!key) return null;
  const state = await getState();
  return (state.signDocuments || []).find((row) => row.code === key) ?? null;
}

export async function createSignDocument(input: {
  filename: string;
  originalPath: string;
  sizeBytes: number;
}): Promise<SignDocument> {
  const box: { doc: SignDocument | null } = { doc: null };
  await updateState((state) => {
    if (!state.signDocuments) state.signDocuments = [];
    const existing = state.signDocuments.find(
      (row) => row.originalPath === input.originalPath,
    );
    if (existing) {
      box.doc = existing;
      return;
    }
    const used = new Set(state.signDocuments.map((row) => row.code));
    let code = generateSignCode();
    for (let i = 0; i < 24 && used.has(code); i += 1) {
      code = generateSignCode();
    }
    const now = new Date();
    const doc: SignDocument = {
      id: `sign_${crypto.randomUUID()}`,
      code,
      filename: input.filename,
      originalPath: input.originalPath,
      signedPath: null,
      status: "pending",
      createdAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + SIGN_TTL_MS).toISOString(),
      signedAt: null,
      signerName: null,
      acknowledged: false,
      sizeBytes: input.sizeBytes,
    };
    state.signDocuments.unshift(doc);
    box.doc = doc;
  });
  if (!box.doc) throw new Error("Could not save document");
  return box.doc;
}

export async function markSignDocumentSigned(input: {
  code: string;
  signerName: string;
  acknowledged: boolean;
  signedPath: string;
  now?: Date;
}): Promise<
  | { ok: true; doc: SignDocument }
  | { ok: false; error: "invalid" | "expired" | "signed" }
> {
  const key = signCodeLookupKey(input.code);
  if (!key) return { ok: false, error: "invalid" };
  let result:
    | { ok: true; doc: SignDocument }
    | { ok: false; error: "invalid" | "expired" | "signed" } = {
    ok: false,
    error: "invalid",
  };
  await updateState((state) => {
    if (!state.signDocuments) state.signDocuments = [];
    const index = state.signDocuments.findIndex((row) => row.code === key);
    if (index < 0) {
      result = { ok: false, error: "invalid" };
      return;
    }
    const current = state.signDocuments[index];
    const status = publicSignStatus(current, (input.now ?? new Date()).getTime());
    if (status !== "pending") {
      result = { ok: false, error: status };
      return;
    }
    const next: SignDocument = {
      ...current,
      status: "signed",
      signedAt: (input.now ?? new Date()).toISOString(),
      signerName: input.signerName,
      acknowledged: input.acknowledged,
      signedPath: input.signedPath,
    };
    state.signDocuments[index] = next;
    result = { ok: true, doc: next };
  });
  return result;
}

export async function deleteSignDocument(id: string): Promise<SignDocument | null> {
  const box: { doc: SignDocument | null } = { doc: null };
  await updateState((state) => {
    if (!state.signDocuments) state.signDocuments = [];
    const index = state.signDocuments.findIndex((row) => row.id === id);
    if (index < 0) return;
    box.doc = state.signDocuments[index];
    state.signDocuments.splice(index, 1);
  });
  return box.doc;
}
