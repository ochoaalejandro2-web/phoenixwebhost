import Image from "next/image";
import { HOLA_TAX_SLUG, clientThemeClass } from "@/lib/client-themes";
import type { Client, ContactNotice } from "@/lib/types";

const PHOTOS = {
  office: {
    src: "/clients/hola-tax-service/office.png",
    alt: "A tax prep office desk with a laptop showing a spreadsheet, a notebook, and a cup of coffee, lit with a neon green accent.",
  },
  calculator: {
    src: "/clients/hola-tax-service/calculator.jpg",
    alt: "A smartphone calculator next to tax documents and a pen on a white wooden desk.",
  },
  desk: {
    src: "/clients/hola-tax-service/desk.jpg",
    alt: "Close-up of paperwork being filled out at a tax prep desk.",
  },
} as const;

type SiteView = {
  client: Client;
  notice?: ContactNotice | null;
};

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function SiteStill({
  src,
  alt,
  preload = false,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  preload?: boolean;
  sizes: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden border border-[#00FF66] bg-black ${className ?? ""}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        className="object-cover"
      />
    </div>
  );
}

function ContactNoticeBanner({
  client,
  notice,
}: {
  client: Client;
  notice?: ContactNotice | null;
}) {
  if (!notice) return null;
  const call = client.phone.trim()
    ? ` Please call ${client.phone.trim()}.`
    : "";
  const ok = notice === "sent";
  const copy =
    notice === "sent"
      ? `Your message was emailed to ${client.businessName}.`
      : notice === "no-email"
        ? `This business has no email on file, so we could not send your message.${call}`
        : notice === "missing"
          ? "Name, a real email, and a message are required."
          : `We could not send your message by email.${call || " Please try again."}`;
  return (
    <p
      role={ok ? "status" : "alert"}
      className={`text-sm ${ok ? "text-[#00E840]" : "text-black"}`}
    >
      {copy}
    </p>
  );
}

/**
 * White / black / neon restyle for Hola Tax Service only.
 * Same professional layout: header, hero, services, hours, contact, footer.
 */
export function HolaTaxSite({ client, notice }: SiteView) {
  return (
    <div
      data-client-slug={HOLA_TAX_SLUG}
      className={`${clientThemeClass(HOLA_TAX_SLUG)} flex min-h-full flex-col bg-white text-black`}
    >
      <header className="border-b border-[#00FF66] bg-white px-5 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <a
            href={`/s/${client.slug}`}
            className="font-display text-lg tracking-tight text-black"
          >
            {client.businessName}
          </a>
          <a
            href={telHref(client.phone)}
            className="text-sm font-semibold text-[#00E840] hover:text-[#00FF66]"
          >
            {client.phone}
          </a>
        </div>
      </header>

      <section className="border-b border-[#00FF66] bg-white">
        <div className="mx-auto max-w-5xl px-5 py-20">
          <p className="text-sm uppercase tracking-[0.22em] text-[#00E840]">
            {client.city}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-tight tracking-tight text-black">
            {client.tagline}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-black/80">{client.about}</p>
          <SiteStill
            src={PHOTOS.office.src}
            alt={PHOTOS.office.alt}
            preload
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="mt-10 aspect-[3/2] w-full"
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 py-14">
        <div className="grid gap-3 sm:grid-cols-2">
          <SiteStill
            src={PHOTOS.calculator.src}
            alt={PHOTOS.calculator.alt}
            sizes="(max-width: 640px) 100vw, 512px"
            className="aspect-[3/2]"
          />
          <SiteStill
            src={PHOTOS.desk.src}
            alt={PHOTOS.desk.alt}
            sizes="(max-width: 640px) 100vw, 512px"
            className="aspect-[3/2]"
          />
        </div>
        <h2 className="mt-10 font-display text-3xl tracking-tight text-black">
          How we help
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {client.services.map((service) => (
            <li
              key={service}
              className="border border-[#00FF66] bg-white px-4 py-3 text-black"
            >
              {service}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-black/80">
          {client.hours} · {client.phone}
        </p>
        <form
          id="contact"
          action={`/api/sites/${client.slug}/contact`}
          method="post"
          className="mt-8 grid gap-3 border border-[#00FF66] bg-white p-6"
        >
          <p className="font-display text-xl tracking-tight text-black">
            Contact
          </p>
          <ContactNoticeBanner client={client} notice={notice} />
          <input
            name="name"
            required
            maxLength={120}
            placeholder="Name"
            autoComplete="name"
            className="rounded-none border border-[#00FF66] bg-white px-3 py-2 text-black outline-none focus:shadow-[0_0_0_3px_rgba(0,255,102,0.25)]"
          />
          <input
            name="email"
            type="email"
            required
            maxLength={200}
            placeholder="Email"
            autoComplete="email"
            className="rounded-none border border-[#00FF66] bg-white px-3 py-2 text-black outline-none focus:shadow-[0_0_0_3px_rgba(0,255,102,0.25)]"
          />
          <input
            name="phone"
            maxLength={40}
            placeholder="Phone"
            autoComplete="tel"
            className="rounded-none border border-[#00FF66] bg-white px-3 py-2 text-black outline-none focus:shadow-[0_0_0_3px_rgba(0,255,102,0.25)]"
          />
          <textarea
            name="message"
            required
            maxLength={4000}
            rows={4}
            placeholder="How can we help?"
            className="rounded-none border border-[#00FF66] bg-white px-3 py-2 text-black outline-none focus:shadow-[0_0_0_3px_rgba(0,255,102,0.25)]"
          />
          <button
            type="submit"
            className="justify-self-start bg-[#00FF66] px-5 py-2 text-sm font-semibold text-black hover:bg-[#00E840]"
          >
            Send
          </button>
        </form>
      </section>

      <footer className="mt-auto border-t border-[#00FF66] bg-white px-5 py-8 text-sm text-black/80">
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
