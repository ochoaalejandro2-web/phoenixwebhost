"use client";

import { useState } from "react";
import { TEMPLATES } from "@/lib/config";

const field =
  "mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm";

export function TaxTemplateFields({
  defaultTemplate = "contractor",
  defaultStaffEmail = "",
}: {
  defaultTemplate?: string;
  defaultStaffEmail?: string;
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
      ) : null}
    </>
  );
}
