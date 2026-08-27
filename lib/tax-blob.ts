import { get, put } from "@vercel/blob";
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
