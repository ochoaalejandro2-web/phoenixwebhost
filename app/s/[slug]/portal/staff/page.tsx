import Link from "next/link";
import { LogoutForm, PortalChrome } from "@/components/tax-portal/PortalChrome";
import { requireTaxStaff } from "@/lib/tax-auth";
import { listTaxCustomers, taxPortalDbReady } from "@/lib/tax-db";
import { requireLiveTaxOffice } from "@/lib/tax-guard";
import { portalPath } from "@/lib/tax-office";

export const dynamic = "force-dynamic";

function fmt(iso: string | null) {
  if (!iso) return "No files yet";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function StaffHomePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = await requireLiveTaxOffice(slug);
  await requireTaxStaff(slug, client.id);
  const customers = taxPortalDbReady() ? await listTaxCustomers(client.id) : [];
  return (
    <PortalChrome client={client} nav={<LogoutForm slug={slug} />}>
      <h1 className="font-display text-3xl tracking-tight">
        Client folders / Carpetas
      </h1>
      <p className="mt-2 max-w-xl text-sm text-black/80">
        {client.businessName} only. Open a folder to download what that client
        uploaded.
      </p>
      {customers.length === 0 ? (
        <p className="mt-8 text-sm text-black/70">No client accounts yet.</p>
      ) : (
        <ul className="mt-8 divide-y divide-[#00FF66] border border-[#00FF66]">
          {customers.map((person) => (
            <li key={person.id}>
              <Link
                href={portalPath(slug, `/staff/${person.id}`)}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 hover:bg-[#00FF66]/10"
              >
                <div>
                  <p className="font-semibold">{person.name}</p>
                  <p className="text-sm text-black/70">
                    {person.email}
                    {person.phone ? ` · ${person.phone}` : ""}
                  </p>
                </div>
                <p className="text-sm">
                  {person.fileCount} file{person.fileCount === 1 ? "" : "s"} ·{" "}
                  {fmt(person.lastUploadAt)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PortalChrome>
  );
}
