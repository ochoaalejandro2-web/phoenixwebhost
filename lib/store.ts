import { promises as fs } from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";
import { createSeedState } from "@/data/seed";
import { findClientByCustomDomain } from "@/lib/custom-domain";
import { withHolaTaxLlcService } from "@/lib/hola-tax-i18n";
import { HOLA_TAX_SLUG } from "@/lib/tax-office";
import type {
  AppState,
  AuthLock,
  Client,
  ContactMessage,
  Lead,
  Review,
  ReviewStatus,
  TemplateId,
} from "@/lib/types";

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
  "salon",
  "restaurant",
  "professional",
  "landscaping",
  "tax",
];

function normalizeClient(client: Client): Client {
  let template = client.template;
  let services = client.services;
  if (client.slug === HOLA_TAX_SLUG) {
    template = "tax";
    services = withHolaTaxLlcService(client.services);
  } else if (!KNOWN_TEMPLATES.includes(template)) {
    template = "professional";
  }
  return {
    ...client,
    template,
    services,
    localBoost: Boolean(client.localBoost),
    stripeBoostSubscriptionId: client.stripeBoostSubscriptionId ?? null,
    businessEmail: Boolean(client.businessEmail),
    stripeEmailSubscriptionId: client.stripeEmailSubscriptionId ?? null,
  };
}

function normalizeLead(lead: Lead): Lead {
  return {
    ...lead,
    wantsLocalBoost: Boolean(lead.wantsLocalBoost),
    wantsBusinessEmail: Boolean(lead.wantsBusinessEmail),
  };
}

function normalizeState(state: AppState): AppState {
  if (!Array.isArray(state.reviews)) state.reviews = [];
  if (!Array.isArray(state.leads)) state.leads = [];
  if (!Array.isArray(state.contactMessages)) state.contactMessages = [];
  if (!Array.isArray(state.clients)) state.clients = [];
  if (!state.authLock) state.authLock = emptyAuthLock();
  if (!Array.isArray(state.authLock.consumedNonces)) {
    state.authLock.consumedNonces = [];
  }
  state.clients = state.clients.map(normalizeClient);
  state.leads = state.leads.map(normalizeLead);
  return state;
}

async function loadUnlocked(): Promise<AppState> {
  const mode = storageMode();
  if (mode === "postgres") {
    const existing = await readPostgres();
    if (existing) return normalizeState(existing);
    const seed = createSeedState();
    await writePostgres(seed);
    bag().memory = seed;
    return seed;
  }
  if (mode === "file") {
    const existing = await readFileState();
    if (existing) return normalizeState(existing);
    const seed = createSeedState();
    await writeFileState(seed);
    bag().memory = seed;
    return seed;
  }
  const cached = bag().memory;
  if (cached) return cached;
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
  return state.clients.find((c) => c.slug === slug) ?? null;
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
        c.stripeEmailSubscriptionId === subscriptionId,
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
  await updateState((state) => {
    state.leads.unshift(lead);
  });
  return lead;
}

export async function getLead(id: string) {
  const state = await getState();
  return state.leads.find((l) => l.id === id) ?? null;
}

export async function addContactMessage(message: ContactMessage) {
  await updateState((state) => {
    state.contactMessages.unshift(message);
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
