export type TaxPortalRole = "customer" | "staff";

export type TaxSession = {
  role: TaxPortalRole;
  userId: string;
  clientId: string;
  email: string;
  name: string;
};

export type TaxFileRecord = {
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

export function canReadTaxFile(
  session: Pick<TaxSession, "role" | "clientId" | "userId">,
  file: Pick<TaxFileRecord, "clientId" | "userId">,
) {
  if (session.clientId !== file.clientId) return false;
  if (session.role === "staff") return true;
  return session.role === "customer" && session.userId === file.userId;
}

export function canUploadAsCustomer(
  session: Pick<TaxSession, "role" | "clientId" | "userId">,
  clientId: string,
) {
  return (
    session.role === "customer" &&
    session.clientId === clientId &&
    Boolean(session.userId)
  );
}

export function blobPathAllowed(
  session: Pick<TaxSession, "clientId" | "userId">,
  pathname: string,
) {
  const prefix = `tax-portal/${session.clientId}/${session.userId}/`;
  return pathname.startsWith(prefix) && !pathname.includes("..");
}
