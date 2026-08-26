import { promises as fs } from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";
import { createSeedState } from "@/data/seed";
import type { AppState, Client, ContactMessage, Lead } from "@/lib/types";

const FILE_PATH = path.join(process.cwd(), "data", "store.json");
const TMP_PATH = "/tmp/phoenixwebhost-store.json";

let memory: AppState | null = null;
let writeChain: Promise<unknown> = Promise.resolve();

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeChain.then(fn, fn);
  writeChain = run.then(
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

async function loadUnlocked(): Promise<AppState> {
  if (memory) return memory;
  const mode = storageMode();
  let state: AppState | null = null;
  if (mode === "postgres") state = await readPostgres();
  else if (mode === "file") state = await readFileState();
  if (!state) {
    state = createSeedState();
    if (mode === "postgres") await writePostgres(state);
    if (mode === "file") await writeFileState(state);
  }
  memory = state;
  return state;
}

async function saveUnlocked(state: AppState) {
  memory = state;
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
  const needle = host.toLowerCase();
  return (
    state.clients.find((c) => c.customDomain?.toLowerCase() === needle) ?? null
  );
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
    state.clients.find((c) => c.stripeSubscriptionId === subscriptionId) ??
    null
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
  return state.contactMessages.filter((m) =>
    clientId ? m.clientId === clientId : true,
  );
}

export async function resetToSeed() {
  const state = createSeedState();
  await enqueue(async () => {
    await saveUnlocked(state);
  });
  return state;
}
