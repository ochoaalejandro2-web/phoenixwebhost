import { TEMPLATES } from "@/lib/config";
import { createClientAction } from "@/app/admin/actions";

const field =
  "mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm";

export default function NewClientPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl">New client site</h1>
      <p className="mt-2 text-ink-soft">
        Fill in the business. A site is generated immediately on a Phoenixwebhost
        subdomain. Payment can be collected after, via Stripe Checkout.
      </p>
      <form action={createClientAction} className="mt-8 grid gap-4">
        <label className="text-sm">
          Business name
          <input name="businessName" required className={field} />
        </label>
        <label className="text-sm">
          Subdomain slug (optional)
          <input name="slug" placeholder="desert-peak-roofing" className={field} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            Contact name
            <input name="contactName" className={field} />
          </label>
          <label className="text-sm">
            Email
            <input name="email" type="email" className={field} />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            Phone
            <input name="phone" className={field} />
          </label>
          <label className="text-sm">
            City
            <input name="city" placeholder="Mesa, AZ" className={field} />
          </label>
        </div>
        <label className="text-sm">
          Address
          <input name="address" className={field} />
        </label>
        <label className="text-sm">
          Hours
          <input name="hours" placeholder="Mon–Fri 8am–5pm" className={field} />
        </label>
        <label className="text-sm">
          Tagline
          <input name="tagline" className={field} />
        </label>
        <label className="text-sm">
          About / copy
          <textarea name="about" rows={4} className={field} />
        </label>
        <label className="text-sm">
          Services (one per line)
          <textarea name="services" rows={4} className={field} />
        </label>
        <label className="text-sm">
          Template
          <select name="template" className={field} defaultValue="contractor">
            {TEMPLATES.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>
                {tpl.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Custom domain (optional)
          <input name="customDomain" placeholder="www.theirshop.com" className={field} />
        </label>
        <button
          type="submit"
          className="mt-2 justify-self-start rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white"
        >
          Generate site
        </button>
      </form>
    </div>
  );
}
