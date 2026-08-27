import type { Client } from "@/lib/types";

export type ContactNotice = "sent" | "no-email" | "send-failed" | "missing";

type SiteView = {
  client: Client;
  notice?: ContactNotice | null;
};

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function SiteChrome({
  client,
  children,
  tone = "light",
}: {
  client: Client;
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div className={dark ? "min-h-full bg-[#111816] text-[#f4efe6]" : "min-h-full bg-paper text-ink"}>
      <header
        className={`border-b px-5 py-4 ${dark ? "border-white/10" : "border-line bg-paper/90"}`}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <a href={`/s/${client.slug}`} className="font-display text-lg">
            {client.businessName}
          </a>
          <a
            href={telHref(client.phone)}
            className={`text-sm font-semibold ${dark ? "text-[#e8b489]" : "text-clay"}`}
          >
            {client.phone}
          </a>
        </div>
      </header>
      {children}
      <footer
        className={`mt-auto border-t px-5 py-8 text-sm ${dark ? "border-white/10 text-white/60" : "border-line text-ink-soft"}`}
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:justify-between">
          <p>
            {client.businessName} · {client.city}
          </p>
          <p>
            {client.address} · {client.hours}
          </p>
        </div>
      </footer>
    </div>
  );
}

function ContactNoticeBanner({
  client,
  invert,
  notice,
}: {
  client: Client;
  invert?: boolean;
  notice?: ContactNotice | null;
}) {
  if (!notice) return null;
  const call = client.phone.trim()
    ? ` Please call ${client.phone.trim()}.`
    : "";
  const tone =
    notice === "sent"
      ? invert
        ? "text-[#b8e0c4]"
        : "text-sage"
      : invert
        ? "text-[#f3c7b4]"
        : "text-clay";
  const copy =
    notice === "sent"
      ? `Your message was emailed to ${client.businessName}.`
      : notice === "no-email"
        ? `This business has no email on file, so we could not send your message.${call}`
        : notice === "missing"
          ? "Name, a real email, and a message are required."
          : `We could not send your message by email.${call || " Please try again."}`;
  return (
    <p role={notice === "sent" ? "status" : "alert"} className={`text-sm ${tone}`}>
      {copy}
    </p>
  );
}

function ContactBlock({
  client,
  invert = false,
  notice,
}: {
  client: Client;
  invert?: boolean;
  notice?: ContactNotice | null;
}) {
  return (
    <form
      id="contact"
      action={`/api/sites/${client.slug}/contact`}
      method="post"
      className={`mt-8 grid gap-3 rounded-2xl p-6 ${invert ? "bg-white/8" : "border border-line bg-paper"}`}
    >
      <p className="font-display text-xl">Contact</p>
      <ContactNoticeBanner client={client} invert={invert} notice={notice} />
      <input name="name" required maxLength={120} placeholder="Name" autoComplete="name" className="rounded-lg border border-line bg-white px-3 py-2 text-ink" />
      <input name="email" type="email" required maxLength={200} placeholder="Email" autoComplete="email" className="rounded-lg border border-line bg-white px-3 py-2 text-ink" />
      <input name="phone" maxLength={40} placeholder="Phone" autoComplete="tel" className="rounded-lg border border-line bg-white px-3 py-2 text-ink" />
      <textarea name="message" required maxLength={4000} rows={4} placeholder="How can we help?" className="rounded-lg border border-line bg-white px-3 py-2 text-ink" />
      <button type="submit" className="justify-self-start rounded-full bg-clay px-5 py-2 text-sm font-semibold text-white">
        Send
      </button>
    </form>
  );
}

export function ContractorSite({ client, notice }: SiteView) {
  return (
    <SiteChrome client={client} tone="dark">
      <section className="mx-auto max-w-5xl px-5 py-16">
        <p className="text-sm uppercase tracking-[0.2em] text-[#e8b489]">
          {client.city}
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-5xl leading-tight">
          {client.tagline}
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-white/75">{client.about}</p>
        <a
          href={`tel:${client.phone.replace(/[^\d+]/g, "")}`}
          className="mt-8 inline-block rounded-full bg-[#c45c26] px-6 py-3 font-semibold"
        >
          Call {client.phone}
        </a>
      </section>
      <section className="bg-[#1b2420] py-14">
        <div className="mx-auto grid max-w-5xl gap-4 px-5 sm:grid-cols-2">
          {client.services.map((service) => (
            <div key={service} className="rounded-xl border border-white/10 p-5">
              {service}
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-5 py-14">
        <p className="text-white/70">
          {client.hours} · {client.address}, {client.city}
        </p>
        <ContactBlock client={client} invert notice={notice} />
      </section>
    </SiteChrome>
  );
}

export function SalonSite({ client, notice }: SiteView) {
  return (
    <SiteChrome client={client}>
      <section className="bg-[#f6efe8]">
        <div className="mx-auto max-w-5xl px-5 py-20">
          <p className="text-sm tracking-[0.22em] text-mesa uppercase">
            {client.city}
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl leading-tight text-ink">
            {client.tagline}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-soft">{client.about}</p>
          <p className="mt-6 text-sm text-ink-soft">{client.hours}</p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-5 py-14">
        <h2 className="font-display text-3xl">Services</h2>
        <ul className="mt-6 divide-y divide-line">
          {client.services.map((service) => (
            <li key={service} className="py-3 text-lg">
              {service}
            </li>
          ))}
        </ul>
        <ContactBlock client={client} notice={notice} />
      </section>
    </SiteChrome>
  );
}

export function RestaurantSite({ client, notice }: SiteView) {
  return (
    <SiteChrome client={client}>
      <section className="bg-[#3a2a22] text-[#f7efe4]">
        <div className="mx-auto max-w-5xl px-5 py-20">
          <p className="uppercase tracking-[0.2em] text-[#d7b48a]">{client.city}</p>
          <h1 className="mt-4 font-display text-5xl leading-tight">{client.tagline}</h1>
          <p className="mt-5 max-w-xl text-lg text-white/75">{client.about}</p>
          <p className="mt-8 text-sm">{client.hours}</p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-5 py-14">
        <h2 className="font-display text-3xl">From the kitchen</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {client.services.map((service) => (
            <article key={service} className="rounded-2xl border border-line p-5">
              <h3 className="font-display text-xl">{service}</h3>
            </article>
          ))}
        </div>
        <p className="mt-8 text-ink-soft">
          {client.address}, {client.city}
        </p>
        <ContactBlock client={client} notice={notice} />
      </section>
    </SiteChrome>
  );
}

function DesertYardMark() {
  return (
    <svg
      viewBox="0 0 280 140"
      className="h-28 w-56 text-[#2f4a38]"
      aria-hidden="true"
    >
      <g fill="currentColor">
        <path d="M36 132h16V78c0-8-4-14-8-14s-8 6-8 14v54Z" />
        <path d="M28 102h10v8H28c-4 0-6-3-6-6s2-6 6-6h2v4h-2c-1 0-2 1-2 2s1 2 2 2Z" />
        <path d="M60 96h10v8H60c4 0 6-3 6-6s-2-6-6-6h-2v4h2c1 0 2 1 2 2s-1 2-2 2Z" />
        <path d="M118 132c18-28 22-52 14-78-6 8-16 18-20 32-6-10-8-22-6-36-16 18-28 44-24 82h36Z" />
        <path d="M168 132h14V70c8-2 16-10 18-20-12 2-22 10-24 20V56c-2-10-10-18-18-20 4 12 6 24 6 34v62Z" />
        <rect x="214" y="108" width="10" height="24" rx="3" />
        <circle cx="219" cy="98" r="16" />
        <circle cx="206" cy="108" r="10" />
        <circle cx="232" cy="110" r="9" />
      </g>
      <path
        d="M8 132h264"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.35"
      />
    </svg>
  );
}

export function LandscapingSite({ client, notice }: SiteView) {
  return (
    <div className="flex min-h-full flex-col bg-[#f3efe4] text-[#1d241c]">
      <header className="border-b border-[#d7d0be] bg-[#f7f3e8]/90 px-5 py-4">
        {client.sample ? (
          <p className="mx-auto mb-3 max-w-5xl rounded-full bg-[#2f4a38] px-4 py-1.5 text-center text-xs font-semibold tracking-wide text-[#f4efe6]">
            Sample site — not a customer account
          </p>
        ) : null}
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <a href={`/s/${client.slug}`} className="font-display text-lg">
            {client.businessName}
          </a>
          <a
            href={telHref(client.phone)}
            className="text-sm font-semibold text-[#3d5a32]"
          >
            {client.phone}
          </a>
        </div>
      </header>
      <section className="relative overflow-hidden bg-gradient-to-b from-[#dce8e0] to-[#f3efe4]">
        <div className="mx-auto grid max-w-5xl items-end gap-8 px-5 pb-10 pt-16 sm:grid-cols-[1.2fr_0.8fr]">
          <div className="py-6">
            <p className="text-sm uppercase tracking-[0.2em] text-[#5d7a4f]">
              {client.city}
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-5xl leading-tight">
              {client.tagline}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-[#4a5346]">{client.about}</p>
            <a
              href={telHref(client.phone)}
              className="mt-8 inline-block rounded-full bg-[#2f4a38] px-6 py-3 font-semibold text-[#f4efe6]"
            >
              Call {client.phone}
            </a>
          </div>
          <div className="hidden justify-self-end pb-4 sm:block">
            <DesertYardMark />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-5 py-14">
        <h2 className="font-display text-3xl">Yard work</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {client.services.map((service) => (
            <article
              key={service}
              className="rounded-2xl border border-[#d7d0be] bg-[#fbf8f0] p-5 shadow-[inset_4px_0_0_#5d7a4f]"
            >
              <h3 className="font-display text-xl">{service}</h3>
            </article>
          ))}
        </div>
        <p className="mt-8 text-sm text-[#4a5346]">
          {client.hours} · {client.address}, {client.city}
        </p>
        <ContactBlock client={client} notice={notice} />
      </section>
      <footer className="mt-auto border-t border-[#d7d0be] px-5 py-8 text-sm text-[#4a5346]">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:justify-between">
          <p>
            {client.businessName} · {client.city}
          </p>
          <p>
            {client.address} · {client.hours}
          </p>
        </div>
      </footer>
    </div>
  );
}

export function ProfessionalSite({ client, notice }: SiteView) {
  return (
    <SiteChrome client={client}>
      <section className="border-b border-line bg-[#eef2ef]">
        <div className="mx-auto max-w-5xl px-5 py-20">
          <p className="text-sm uppercase tracking-[0.18em] text-sage">{client.city}</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-tight">
            {client.tagline}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-soft">{client.about}</p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-5 py-14">
        <h2 className="font-display text-3xl">How we help</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {client.services.map((service) => (
            <li key={service} className="rounded-xl border border-line bg-paper px-4 py-3">
              {service}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-ink-soft">
          {client.hours} · {client.phone}
        </p>
        <ContactBlock client={client} notice={notice} />
      </section>
    </SiteChrome>
  );
}

export function OfflineSite({ client }: { client: Client }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sand px-6 py-20 text-center text-ink">
      <p className="text-sm uppercase tracking-[0.18em] text-mesa">
        Phoenixwebhost Inc.
      </p>
      <h1 className="mt-4 max-w-xl font-display text-4xl">
        This website is temporarily offline
      </h1>
      <p className="mt-4 max-w-lg text-ink-soft">
        {client.businessName} is not available right now. If this is your site,
        contact Phoenixwebhost Inc. to restore service.
      </p>
      <p className="mt-2 max-w-lg text-ink-soft">
        Este sitio está temporalmente fuera de línea. Si es suyo, escriba a
        Phoenixwebhost Inc. para restablecerlo.
      </p>
      <p className="mt-8 text-sm text-ink-soft">hello@phoenixwebhost.com</p>
    </div>
  );
}

export function TakenDownSite() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 py-20 text-center text-ink">
      <h1 className="font-display text-4xl">This site is no longer available</h1>
      <p className="mt-4 text-ink-soft">
        Files were kept for 30 days after the account went unpaid, then removed.
      </p>
    </div>
  );
}

export function renderClientSite(
  client: Client,
  notice?: ContactNotice | null,
) {
  if (client.siteStatus === "taken_down") return <TakenDownSite />;
  if (client.siteStatus === "offline" || client.siteStatus === "paused") {
    return <OfflineSite client={client} />;
  }
  switch (client.template) {
    case "salon":
      return <SalonSite client={client} notice={notice} />;
    case "restaurant":
      return <RestaurantSite client={client} notice={notice} />;
    case "professional":
      return <ProfessionalSite client={client} notice={notice} />;
    case "landscaping":
      return <LandscapingSite client={client} notice={notice} />;
    default:
      return <ContractorSite client={client} notice={notice} />;
  }
}
