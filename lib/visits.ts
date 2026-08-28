import { promises as fs } from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";

const FILE_PATH = path.join(process.cwd(), "data", "visits.json");
const TMP_PATH = "/tmp/phoenixwebhost-visits.json";
const BAG_KEY = "__phoenixwebhost_visits__";
const SCHEMA_KEY = "__phoenixwebhost_visits_schema__";

export const VISIT_TZ = "America/Phoenix";

export type VisitTotals = {
  today: number;
  last7: number;
  last30: number;
};

type VisitBag = {
  memory: Record<string, number> | null;
  writeChain: Promise<unknown>;
};

function bag(): VisitBag {
  const g = globalThis as typeof globalThis & { [BAG_KEY]?: VisitBag };
  if (!g[BAG_KEY]) {
    g[BAG_KEY] = { memory: null, writeChain: Promise.resolve() };
  }
  return g[BAG_KEY];
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

function visitsStorageMode(): "postgres" | "file" | "memory" {
  if (process.env.DATABASE_URL || process.env.POSTGRES_URL) return "postgres";
  if (process.env.VERCEL) return "memory";
  return "file";
}

function databaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
}

function filePath() {
  return process.env.VERCEL ? TMP_PATH : FILE_PATH;
}

/** Calendar day in Phoenix, AZ as YYYY-MM-DD. */
export function dayKey(date = new Date(), timeZone = VISIT_TZ): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function shiftDay(day: string, delta: number): string {
  const [year, month, date] = day.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, date));
  utc.setUTCDate(utc.getUTCDate() + delta);
  const yyyy = utc.getUTCFullYear();
  const mm = String(utc.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(utc.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function visitWindows(today = dayKey()) {
  return {
    today,
    last7From: shiftDay(today, -6),
    last30From: shiftDay(today, -29),
  };
}

export function sumVisits(
  rows: Record<string, number>,
  fromDay: string,
  toDay: string,
): number {
  let total = 0;
  for (let day = fromDay; day <= toDay; day = shiftDay(day, 1)) {
    total += rows[day] || 0;
    if (day === toDay) break;
  }
  return total;
}

export function totalsFromRows(
  rows: Record<string, number>,
  today = dayKey(),
): VisitTotals {
  const { last7From, last30From } = visitWindows(today);
  return {
    today: rows[today] || 0,
    last7: sumVisits(rows, last7From, today),
    last30: sumVisits(rows, last30From, today),
  };
}

export function isLikelyBot(userAgent: string): boolean {
  return /bot|crawler|spider|crawling|preview|slurp|facebookexternalhit|pingdom|lighthouse|headless/i.test(
    userAgent,
  );
}

async function ensureTable() {
  const url = databaseUrl();
  if (!url) return;
  const g = globalThis as typeof globalThis & { [SCHEMA_KEY]?: boolean };
  if (g[SCHEMA_KEY]) return;
  const sql = neon(url);
  await sql`CREATE TABLE IF NOT EXISTS site_daily_visits (
    day DATE PRIMARY KEY,
    views INTEGER NOT NULL DEFAULT 0
  )`;
  g[SCHEMA_KEY] = true;
}

async function readFileRows(): Promise<Record<string, number>> {
  try {
    const raw = await fs.readFile(filePath(), "utf8");
    const parsed = JSON.parse(raw) as Record<string, number>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function writeFileRows(rows: Record<string, number>) {
  const target = filePath();
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, JSON.stringify(rows), "utf8");
}

export async function recordVisit(now = new Date()): Promise<void> {
  const day = dayKey(now);
  const mode = visitsStorageMode();
  if (mode === "postgres") {
    await ensureTable();
    const sql = neon(databaseUrl());
    await sql`INSERT INTO site_daily_visits (day, views)
      VALUES (${day}::date, 1)
      ON CONFLICT (day) DO UPDATE SET views = site_daily_visits.views + 1`;
    return;
  }
  await enqueue(async () => {
    const rows =
      mode === "memory"
        ? { ...(bag().memory || {}) }
        : await readFileRows();
    rows[day] = (rows[day] || 0) + 1;
    bag().memory = rows;
    if (mode === "file") await writeFileRows(rows);
  });
}

export async function visitTotals(now = new Date()): Promise<VisitTotals> {
  const today = dayKey(now);
  const mode = visitsStorageMode();
  if (mode === "postgres") {
    await ensureTable();
    const sql = neon(databaseUrl());
    const { last30From } = visitWindows(today);
    const rows = (await sql`
      SELECT day::text AS day, views
      FROM site_daily_visits
      WHERE day >= ${last30From}::date
    `) as { day: string; views: number }[];
    const map: Record<string, number> = {};
    for (const row of rows) {
      map[String(row.day).slice(0, 10)] = Number(row.views) || 0;
    }
    return totalsFromRows(map, today);
  }
  const rows =
    mode === "memory"
      ? bag().memory || {}
      : await readFileRows();
  if (mode === "file") bag().memory = rows;
  return totalsFromRows(rows, today);
}
