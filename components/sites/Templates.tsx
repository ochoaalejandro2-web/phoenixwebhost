import type { Client } from "@/lib/types";

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

function ContactBlock({ client, invert = false }: { client: Client; invert?: boolean }) {
  return (
    <form
      action={`/api/sites/${client.slug}/contact`}
      method="post"
      className={`mt-8 grid gap-3 rounded-2xl p-6 ${invert ? "bg-white/8" : "border border-line bg-paper"}`}
    >
      <p className="font-display text-xl">Contact</p>
      <input name="name" required placeholder="Name" className="rounded-lg border border-line bg-white px-3 py-2 text-ink" />
      <input name="email" type="email" required placeholder="Email" className="rounded-lg border border-line bg-white px-3 py-2 text-ink" />
      <input name="phone" placeholder="Phone" className="rounded-lg border border-line bg-white px-3 py-2 text-ink" />
      <textarea name="message" required rows={4} placeholder="How can we help?" className="rounded-lg border border-line bg-white px-3 py-2 text-ink" />
      <button type="submit" className="justify-self-start rounded-full bg-clay px-5 py-2 text-sm font-semibold text-white">
        Send
      </button>
    </form>
  );
}

export function ContractorSite({ client }: { client: Client }) {
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
        <ContactBlock client={client} invert />
      </section>
    </SiteChrome>
  );
}

export function SalonSite({ client }: { client: Client }) {
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
        <ContactBlock client={client} />
      </section>
    </SiteChrome>
  );
}

export function RestaurantSite({ client }: { client: Client }) {
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
        <ContactBlock client={client} />
      </section>
    </SiteChrome>
  );
}

export function ProfessionalSite({ client }: { client: Client }) {
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
        <ContactBlock client={client} />
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

export function renderClientSite(client: Client) {
  if (client.siteStatus === "taken_down") return <TakenDownSite />;
  if (client.siteStatus === "offline" || client.siteStatus === "paused") {
    return <OfflineSite client={client} />;
  }
  switch (client.template) {
    case "salon":
      return <SalonSite client={client} />;
    case "restaurant":
      return <RestaurantSite client={client} />;
    case "professional":
      return <ProfessionalSite client={client} />;
    default:
      return <ContractorSite client={client} />;
  }
}
