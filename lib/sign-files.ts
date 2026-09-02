import { promises as fs } from "fs";
import path from "path";
import { del, get, list, put } from "@vercel/blob";
import {
  SIGN_BLOB_PREFIX,
  signBlobPath,
  signCleanupPaths,
  signCleanupPrefixes,
  signPathAllowed,
} from "@/lib/sign";

const LOCAL_ROOT = path.join(process.cwd(), "data", "sign-files");
const TMP_ROOT = path.join("/tmp", "phoenixwebhost-sign-files");

export type SignFilesMode = "blob" | "local" | "none";

export function signFilesMode(): SignFilesMode {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  if (!process.env.VERCEL) return "local";
  return "none";
}

export function signFilesReady() {
  return signFilesMode() !== "none";
}

export function signBlobReady() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function localRoot() {
  return process.env.VERCEL ? TMP_ROOT : LOCAL_ROOT;
}

function signLocalRoot() {
  return path.resolve(localRoot(), SIGN_BLOB_PREFIX);
}

function insideSignRoot(full: string) {
  const root = signLocalRoot();
  return full === root || full.startsWith(root + path.sep);
}

function localFullPath(pathname: string) {
  if (!signPathAllowed(pathname)) {
    throw new Error("Invalid sign file path");
  }
  const full = path.resolve(localRoot(), pathname);
  if (!insideSignRoot(full)) {
    throw new Error("Invalid sign file path");
  }
  return full;
}

export async function putSignFile(
  pathname: string,
  body: Buffer | Uint8Array,
  contentType = "application/pdf",
) {
  if (!signPathAllowed(pathname)) {
    throw new Error("Invalid sign file path");
  }
  const bytes = Buffer.from(body);
  const mode = signFilesMode();
  if (mode === "blob") {
    const result = await put(pathname, bytes, {
      access: "private",
      addRandomSuffix: true,
      allowOverwrite: false,
      contentType,
    });
    return { pathname: result.pathname };
  }
  if (mode === "local") {
    const full = localFullPath(pathname);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, bytes);
    return { pathname };
  }
  throw new Error("Sign file storage is not configured");
}

export async function getSignFileBytes(pathname: string) {
  if (!signPathAllowed(pathname)) return null;
  const mode = signFilesMode();
  if (mode === "blob") {
    const result = await get(pathname, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    return Buffer.from(await new Response(result.stream).arrayBuffer());
  }
  if (mode === "local") {
    try {
      return await fs.readFile(localFullPath(pathname));
    } catch {
      return null;
    }
  }
  return null;
}

async function listBlobPathnames(prefix: string) {
  if (!signPathAllowed(prefix) || prefix === SIGN_BLOB_PREFIX) return [];
  const pathnames: string[] = [];
  let cursor: string | undefined;
  do {
    const result = await list({ prefix, limit: 1000, cursor });
    for (const blob of result.blobs) {
      if (signPathAllowed(blob.pathname)) pathnames.push(blob.pathname);
    }
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);
  return pathnames;
}

async function deleteLocalPrefix(prefix: string) {
  if (!signPathAllowed(prefix) || prefix === SIGN_BLOB_PREFIX) return;
  const dir = path.resolve(localRoot(), prefix);
  if (!insideSignRoot(dir) || dir === signLocalRoot()) return;
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return;
  }
  await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry);
      if (!insideSignRoot(full)) return;
      try {
        const stat = await fs.lstat(full);
        if (stat.isFile() || stat.isSymbolicLink()) await fs.unlink(full);
      } catch {
        /* already gone */
      }
    }),
  );
  try {
    await fs.rmdir(dir);
  } catch {
    /* not empty or already gone */
  }
}

export async function deleteSignFiles(doc: {
  id: string;
  originalPath: string;
  signedPath: string | null;
}) {
  const known = signCleanupPaths([
    doc.originalPath,
    doc.signedPath,
    signBlobPath(doc.id, "signed"),
  ]);
  const prefixes = signCleanupPrefixes([
    doc.originalPath,
    doc.signedPath,
    signBlobPath(doc.id, "signed"),
  ]);
  const mode = signFilesMode();
  if (mode === "blob") {
    const leftovers: string[] = [];
    for (const prefix of prefixes) {
      try {
        leftovers.push(...(await listBlobPathnames(prefix)));
      } catch (error) {
        console.error("[sign] blob list failed", prefix, error);
      }
    }
    const all = [...new Set([...known, ...leftovers])].filter(signPathAllowed);
    if (all.length > 0) await del(all);
    return;
  }
  if (mode === "local") {
    await Promise.all(
      known.map(async (pathname) => {
        try {
          await fs.unlink(localFullPath(pathname));
        } catch {
          /* already gone */
        }
      }),
    );
    await Promise.all(prefixes.map((prefix) => deleteLocalPrefix(prefix)));
  }
}
