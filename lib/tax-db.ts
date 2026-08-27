import { neon } from "@neondatabase/serverless";
import { hash } from "bcryptjs";
import type { TaxPortalRole } from "@/lib/tax-access";
import type { TaxDocLabel } from "@/lib/tax-office";

const BCRYPT_ROUNDS = 12;
const SCHEMA_KEY = "__tax_portal_schema_ready__";

export class TaxPortalUnavailableError extends Error {
  constructor(public readonly missing: "database" | "blob") {
    super(
      missing === "database"
        ? "Tax document portal needs DATABASE_URL."
        : "Tax document portal needs BLOB_READ_WRITE_TOKEN.",
    );
    this.name = "TaxPortalUnavailableError";
  }
}

function databaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
}

export function taxPortalDbReady() {
  return Boolean(databaseUrl());
}

export function taxPortalBlobReady() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function schemaBag() {
  const g = globalThis as typeof globalThis & { [SCHEMA_KEY]?: boolean };
  return g;
}

async function sql() {
  const url = databaseUrl();
  if (!url) throw new TaxPortalUnavailableError("database");
  const client = neon(url);
  const bag = schemaBag();
  if (!bag[SCHEMA_KEY]) {
    await migrate();
    bag[SCHEMA_KEY] = true;
  }
  return client;
}

async function migrate() {
  const url = databaseUrl();
  if (!url) throw new TaxPortalUnavailableError("database");
  const client = neon(url);
  await client`CREATE TABLE IF NOT EXISTS tax_portal_users (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (client_id, email)
  )`;
  await client`CREATE INDEX IF NOT EXISTS tax_portal_users_client_idx
    ON tax_portal_users (client_id)`;
  await client`CREATE TABLE IF NOT EXISTS tax_portal_files (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    label TEXT NOT NULL,
    filename TEXT NOT NULL,
    content_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    blob_pathname TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  await client`CREATE INDEX IF NOT EXISTS tax_portal_files_owner_idx
    ON tax_portal_files (client_id, user_id)`;
  await client`CREATE TABLE IF NOT EXISTS tax_portal_auth_lock (
    client_id TEXT NOT NULL,
    email TEXT NOT NULL,
    fails INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ,
    PRIMARY KEY (client_id, email)
  )`;
}

export type TaxUserRow = {
  id: string;
  clientId: string;
  email: string;
  name: string;
  phone: string;
  role: TaxPortalRole;
  createdAt: string;
  passwordHash?: string;
};

type UserSql = {
  id: string;
  client_id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  created_at: string;
  password_hash?: string;
};

function mapUser(row: UserSql, withHash = false): TaxUserRow {
  return {
    id: row.id,
    clientId: row.client_id,
    email: row.email,
    name: row.name,
    phone: row.phone,
    role: row.role === "staff" ? "staff" : "customer",
    createdAt:
      typeof row.created_at === "string"
        ? row.created_at
        : new Date(row.created_at).toISOString(),
    ...(withHash && row.password_hash
      ? { passwordHash: row.password_hash }
      : {}),
  };
}

export async function findTaxUserByEmail(clientId: string, email: string) {
  const db = await sql();
  const rows = (await db`SELECT id, client_id, email, name, phone, role,
    created_at, password_hash
    FROM tax_portal_users
    WHERE client_id = ${clientId} AND email = ${email.toLowerCase()}
    LIMIT 1`) as UserSql[];
  return rows[0] ? mapUser(rows[0], true) : null;
}

export async function findTaxUserById(clientId: string, userId: string) {
  const db = await sql();
  const rows = (await db`SELECT id, client_id, email, name, phone, role, created_at
    FROM tax_portal_users
    WHERE client_id = ${clientId} AND id = ${userId}
    LIMIT 1`) as UserSql[];
  return rows[0] ? mapUser(rows[0]) : null;
}

export async function createTaxCustomer(input: {
  clientId: string;
  email: string;
  password: string;
  name: string;
  phone: string;
}) {
  const db = await sql();
  const id = `taxu_${crypto.randomUUID()}`;
  const passwordHash = await hash(input.password, BCRYPT_ROUNDS);
  const email = input.email.trim().toLowerCase();
  await db`INSERT INTO tax_portal_users
    (id, client_id, email, password_hash, name, phone, role)
    VALUES (${id}, ${input.clientId}, ${email}, ${passwordHash},
      ${input.name.trim()}, ${input.phone.trim()}, 'customer')`;
  return findTaxUserById(input.clientId, id);
}

export async function upsertTaxStaffUser(input: {
  clientId: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
}) {
  const db = await sql();
  const email = input.email.trim().toLowerCase();
  const passwordHash = await hash(input.password, BCRYPT_ROUNDS);
  const existing = await findTaxUserByEmail(input.clientId, email);
  if (existing) {
    await db`UPDATE tax_portal_users
      SET password_hash = ${passwordHash},
          name = ${input.name.trim() || existing.name},
          role = 'staff'
      WHERE client_id = ${input.clientId} AND id = ${existing.id}`;
    return findTaxUserById(input.clientId, existing.id);
  }
  const id = `taxu_${crypto.randomUUID()}`;
  await db`INSERT INTO tax_portal_users
    (id, client_id, email, password_hash, name, phone, role)
    VALUES (${id}, ${input.clientId}, ${email}, ${passwordHash},
      ${input.name.trim() || "Staff"}, ${input.phone?.trim() || ""}, 'staff')`;
  return findTaxUserById(input.clientId, id);
}

export async function listTaxStaff(clientId: string) {
  const db = await sql();
  const rows = (await db`SELECT id, client_id, email, name, phone, role, created_at
    FROM tax_portal_users
    WHERE client_id = ${clientId} AND role = 'staff'
    ORDER BY created_at ASC`) as UserSql[];
  return rows.map((row) => mapUser(row));
}

export async function listTaxCustomers(clientId: string) {
  const db = await sql();
  const rows = (await db`SELECT u.id, u.client_id, u.email, u.name, u.phone, u.role,
      u.created_at,
      COUNT(f.id)::int AS file_count,
      MAX(f.created_at) AS last_upload_at
    FROM tax_portal_users u
    LEFT JOIN tax_portal_files f
      ON f.user_id = u.id AND f.client_id = u.client_id
    WHERE u.client_id = ${clientId} AND u.role = 'customer'
    GROUP BY u.id
    ORDER BY u.created_at DESC`) as (UserSql & {
    file_count: number;
    last_upload_at: string | null;
  })[];
  return rows.map((row) => ({
    ...mapUser(row),
    fileCount: Number(row.file_count || 0),
    lastUploadAt: row.last_upload_at
      ? typeof row.last_upload_at === "string"
        ? row.last_upload_at
        : new Date(row.last_upload_at).toISOString()
      : null,
  }));
}

export type TaxFileRow = {
  id: string;
  clientId: string;
  userId: string;
  label: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
  blobPathname: string;
  createdAt: string;
};

type FileSql = {
  id: string;
  client_id: string;
  user_id: string;
  label: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  blob_pathname: string;
  created_at: string;
};

function mapFile(row: FileSql): TaxFileRow {
  return {
    id: row.id,
    clientId: row.client_id,
    userId: row.user_id,
    label: row.label,
    filename: row.filename,
    contentType: row.content_type,
    sizeBytes: Number(row.size_bytes),
    blobPathname: row.blob_pathname,
    createdAt:
      typeof row.created_at === "string"
        ? row.created_at
        : new Date(row.created_at).toISOString(),
  };
}

export async function listTaxFiles(clientId: string, userId: string) {
  const db = await sql();
  const rows = (await db`SELECT id, client_id, user_id, label, filename,
      content_type, size_bytes, blob_pathname, created_at
    FROM tax_portal_files
    WHERE client_id = ${clientId} AND user_id = ${userId}
    ORDER BY created_at DESC`) as FileSql[];
  return rows.map(mapFile);
}

export async function getTaxFile(clientId: string, fileId: string) {
  const db = await sql();
  const rows = (await db`SELECT id, client_id, user_id, label, filename,
      content_type, size_bytes, blob_pathname, created_at
    FROM tax_portal_files
    WHERE client_id = ${clientId} AND id = ${fileId}
    LIMIT 1`) as FileSql[];
  return rows[0] ? mapFile(rows[0]) : null;
}

export async function insertTaxFile(input: {
  clientId: string;
  userId: string;
  label: TaxDocLabel;
  filename: string;
  contentType: string;
  sizeBytes: number;
  blobPathname: string;
}) {
  const db = await sql();
  const existing =
    (await db`SELECT id, client_id, user_id, label, filename, content_type,
      size_bytes, blob_pathname, created_at
      FROM tax_portal_files
      WHERE blob_pathname = ${input.blobPathname}
      LIMIT 1`) as FileSql[];
  if (existing[0]) {
    if (existing[0].client_id !== input.clientId || existing[0].user_id !== input.userId) {
      throw new Error("blob pathname belongs to another folder");
    }
    await db`UPDATE tax_portal_files
      SET label = ${input.label},
          filename = ${input.filename},
          content_type = ${input.contentType},
          size_bytes = CASE
            WHEN ${input.sizeBytes} > size_bytes THEN ${input.sizeBytes}
            ELSE size_bytes
          END
      WHERE id = ${existing[0].id} AND client_id = ${input.clientId}`;
    return getTaxFile(input.clientId, existing[0].id);
  }
  const id = `taxf_${crypto.randomUUID()}`;
  await db`INSERT INTO tax_portal_files
    (id, client_id, user_id, label, filename, content_type, size_bytes, blob_pathname)
    VALUES (${id}, ${input.clientId}, ${input.userId}, ${input.label},
      ${input.filename}, ${input.contentType}, ${input.sizeBytes}, ${input.blobPathname})`;
  return getTaxFile(input.clientId, id);
}

export async function countTaxCustomers(clientId: string) {
  const db = await sql();
  const rows = (await db`SELECT COUNT(*)::int AS n FROM tax_portal_users
    WHERE client_id = ${clientId} AND role = 'customer'`) as { n: number }[];
  return Number(rows[0]?.n || 0);
}

const MAX_FAILS = 8;
const LOCK_MS = 10 * 60 * 1000;

export async function taxLoginLocked(clientId: string, email: string) {
  const db = await sql();
  const rows = (await db`SELECT fails, locked_until FROM tax_portal_auth_lock
    WHERE client_id = ${clientId} AND email = ${email.toLowerCase()}`) as {
    fails: number;
    locked_until: string | null;
  }[];
  const until = rows[0]?.locked_until
    ? new Date(rows[0].locked_until).getTime()
    : 0;
  return until > Date.now();
}

export async function recordTaxLoginFail(clientId: string, email: string) {
  const db = await sql();
  const key = email.toLowerCase();
  await db`INSERT INTO tax_portal_auth_lock (client_id, email, fails, locked_until)
    VALUES (${clientId}, ${key}, 1, NULL)
    ON CONFLICT (client_id, email) DO UPDATE SET
      fails = tax_portal_auth_lock.fails + 1`;
  const rows = (await db`SELECT fails FROM tax_portal_auth_lock
    WHERE client_id = ${clientId} AND email = ${key}`) as { fails: number }[];
  const fails = Number(rows[0]?.fails || 0);
  if (fails >= MAX_FAILS) {
    const until = new Date(Date.now() + LOCK_MS).toISOString();
    await db`UPDATE tax_portal_auth_lock
      SET fails = 0, locked_until = ${until}
      WHERE client_id = ${clientId} AND email = ${key}`;
  }
}

export async function clearTaxLoginFails(clientId: string, email: string) {
  const db = await sql();
  await db`DELETE FROM tax_portal_auth_lock
    WHERE client_id = ${clientId} AND email = ${email.toLowerCase()}`;
}
