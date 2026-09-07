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

export function canUploadAsStaff(
  session: Pick<TaxSession, "role" | "clientId">,
  clientId: string,
) {
  return session.role === "staff" && session.clientId === clientId;
}

export function blobPathAllowed(
  session: Pick<TaxSession, "role" | "clientId" | "userId">,
  pathname: string,
  ownerUserId?: string,
) {
  if (!pathname || pathname.includes("..")) return false;
  if (session.role === "staff") {
    const owner = ownerUserId || "";
    const prefix = owner
      ? `tax-portal/${session.clientId}/${owner}/`
      : `tax-portal/${session.clientId}/`;
    return pathname.startsWith(prefix);
  }
  return pathname.startsWith(
    `tax-portal/${session.clientId}/${session.userId}/`,
  );
}
