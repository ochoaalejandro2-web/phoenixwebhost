"use client";

import { useState } from "react";
import { TEMPLATES } from "@/lib/config";

const field =
  "mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm";

export function TaxBrandFields({
  defaults = {},
}: {
  defaults?: {
    logoText?: string;
    logoSrc?: string;
    ownerPhotoSrc?: string;
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
  };
}) {
  return (
    <fieldset className="grid gap-3 rounded-xl border border-line bg-paper p-4">
      <legend className="px-1 text-sm font-semibold">Tax office brand</legend>
      <p className="text-sm text-ink-soft">
        New tax shops use the P&A Pro layout (navy/neon, What we do, Call +
        Schedule). Put a circular logo in <code>public/clients/{"{slug}"}/</code>{" "}
        and paste the public path. Owner photo and socials are optional.
        WhatsApp is built from the phone number if you leave it blank. Swap
        colors later with a <code>.theme-{"{slug}"}</code> block in{" "}
        <code>app/globals.css</code>.
      </p>
      <label className="text-sm">
        Header name
        <input
          name="logoText"
          defaultValue={defaults.logoText || ""}
          placeholder="P&A Financial"
          className={field}
        />
      </label>
      <label className="text-sm">
        Circular logo path
        <input
          name="logoSrc"
          defaultValue={defaults.logoSrc || ""}
          placeholder="/clients/their-slug/logo-brand.svg"
          className={field}
        />
      </label>
      <label className="text-sm">
        Owner photo path
        <input
          name="ownerPhotoSrc"
          defaultValue={defaults.ownerPhotoSrc || ""}
          placeholder="/clients/their-slug/owner.jpg"
          className={field}
        />
      </label>
      <label className="text-sm">
        Instagram URL
        <input
          name="instagram"
          defaultValue={defaults.instagram || ""}
          placeholder="https://www.instagram.com/theirshop"
          className={field}
        />
      </label>
      <label className="text-sm">
        Facebook URL
        <input
          name="facebook"
          defaultValue={defaults.facebook || ""}
          placeholder="https://www.facebook.com/theirshop"
          className={field}
        />
      </label>
      <label className="text-sm">
        WhatsApp URL
        <input
          name="whatsapp"
          defaultValue={defaults.whatsapp || ""}
          placeholder="https://wa.me/1…"
          className={field}
        />
      </label>
    </fieldset>
  );
}

export function TaxTemplateFields({
  defaultTemplate = "contractor",
  defaultStaffEmail = "",
  brandDefaults,
}: {
  defaultTemplate?: string;
  defaultStaffEmail?: string;
  brandDefaults?: Parameters<typeof TaxBrandFields>[0]["defaults"];
}) {
  const [template, setTemplate] = useState(defaultTemplate);
  const tax = template === "tax";
  return (
    <>
      <label className="text-sm">
        Template
        <select
          name="template"
          className={field}
          value={template}
          onChange={(event) => setTemplate(event.target.value)}
        >
          {TEMPLATES.map((tpl) => (
            <option key={tpl.id} value={tpl.id}>
              {tpl.name}
            </option>
          ))}
        </select>
      </label>
      {tax ? (
        <>
          <TaxBrandFields defaults={brandDefaults} />
          <fieldset className="grid gap-3 rounded-xl border border-line bg-paper p-4">
            <legend className="px-1 text-sm font-semibold">Tax office portal</legend>
            <p className="text-sm text-ink-soft">
              This template includes a private client drop box on the generated
              site. Clients of this tax shop sign up there. Staff login is for
              this office only — it does not use the Phoenixwebhost owner
              password, and it cannot see other shops’ folders.
            </p>
            <label className="text-sm">
              Staff email (tax preparer)
              <input
                name="taxStaffEmail"
                type="email"
                defaultValue={defaultStaffEmail}
                placeholder="preparer@theiroffice.com"
                className={field}
              />
            </label>
            <label className="text-sm">
              Staff password
              <input
                name="taxStaffPassword"
                type="password"
                minLength={8}
                autoComplete="new-password"
                className={field}
              />
            </label>
            <p className="text-xs text-ink-soft">
              Leave the password blank to set it later on this client page. Do not
              reuse the Phoenixwebhost owner password.
            </p>
          </fieldset>
        </>
      ) : null}
    </>
  );
}
