import { del, get, put } from "@vercel/blob";
import { TaxPortalUnavailableError, taxPortalBlobReady } from "@/lib/tax-db";

export function requireTaxBlob() {
  if (!taxPortalBlobReady()) {
    throw new TaxPortalUnavailableError("blob");
  }
}

export async function putPrivateTaxBlob(
  pathname: string,
  body: Buffer | Blob | File | ReadableStream | ArrayBuffer,
  contentType: string,
) {
  requireTaxBlob();
  return put(pathname, body, {
    access: "private",
    addRandomSuffix: true,
    contentType,
  });
}

export async function getPrivateTaxBlob(pathname: string) {
  requireTaxBlob();
  const result = await get(pathname, { access: "private" });
  if (!result || result.statusCode !== 200) return null;
  return result;
}

function taxBlobPathAllowed(pathname: string) {
  return Boolean(
    pathname &&
      pathname.startsWith("tax-portal/") &&
      !pathname.includes(".."),
  );
}

export async function deletePrivateTaxBlobs(pathnames: string[]) {
  requireTaxBlob();
  const allowed = pathnames.filter(taxBlobPathAllowed);
  if (allowed.length === 0) return;
  await del(allowed);
}
