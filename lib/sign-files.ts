import { promises as fs } from "fs";
import path from "path";
import { get, put } from "@vercel/blob";
import { SIGN_BLOB_PREFIX, signPathAllowed } from "@/lib/sign";

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

function localFullPath(pathname: string) {
  if (!signPathAllowed(pathname)) {
    throw new Error("Invalid sign file path");
  }
  const full = path.resolve(localRoot(), pathname);
  const root = path.resolve(localRoot(), SIGN_BLOB_PREFIX);
  if (!full.startsWith(root)) {
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
