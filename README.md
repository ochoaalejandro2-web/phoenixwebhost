# Phoenixwebhost Inc.

Arizona small-business websites. **$200 to launch. $69/month to keep it live.** Optional **Local Boost** add-on: **$99 once + $79/month extra**. Optional **Business Email** add-on: **$49 once + $19/month extra**.

Owner: **Alex Ochoa**, Phoenix, AZ  
Company: **Phoenixwebhost Inc.**  
Site: [phoenixwebhost.com](https://phoenixwebhost.com)

This repo is only Phoenixwebhost. It is a separate business: marketing site, owner panel, Stripe billing, and a small site factory.

## What customers buy

| | Price | Covers |
| --- | --- | --- |
| Launch | **$200 once** | A simple small-business website |
| Stay live | **$69 / month** | Hosting plus limited care (not unlimited changes) |
| Local Boost (optional) | **$99 once + $79 / month extra** | Google Business Profile setup and a small local ad to the client's own site, then ongoing listing and ad care. Not magic SEO. |
| Business Email (optional) | **$49 once + $19 / month extra** | One professional inbox such as info@the client’s domain, then keep that inbox working. A real business email so customers take them seriously — not magic. |

Buying launch and care still works with Boost and Business Email unchecked. Each is a separate add-on at signup, or later from the owner panel.

**$69/month includes**

- Site stays live, SSL, backups, uptime watch, basic security
- Up to **30 minutes** of small edits per month, **or 2 small requests**
- Hours, phone, address, prices, a sentence or two, swap a photo they send
- 1 contact form
- A short monthly note
- Support about **their** site only

**Not included (charge separately)**

- New page: **$75–$150**
- Many photos: quoted
- Shop: quoted
- Logo: **$100–$300**
- Ads / SEO: extra, or skip at first. Optional **Local Boost** is the local-visibility add-on (Google profile + a small ad). Not magic SEO.
- A professional inbox: extra, or skip. Optional **Business Email** is one mailbox such as info@their domain, plus $19/month to keep it working. Not magic.
- Unlimited changes: **never**

**If a month is unpaid:** reminder → site shows “temporarily offline” → files kept **30 days** → take down.

## Run locally

```bash
npm install
cp .env.example .env.local
# set AUTH_SECRET to any long random string
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| | |
| --- | --- |
| Marketing (EN) | `/` |
| Marketing (ES) | `/es` |
| Request a site | `/request` |
| Owner login | `/login` |
| Demo contractor | `/s/desert-peak-roofing` (paid, live) |
| Demo salon | `/s/casa-luna-salon` (paid, live) |
| Demo restaurant | `/s/mesa-street-kitchen` (overdue, offline) |
| Demo landscaping (sample) | `/s/palo-verde-yards` (paid, live) |
| Hola Tax (tax office template) | `/s/hola-tax-service` (paid, live) · client portal `/s/hola-tax-service/portal` |

**Owner login**

Use `/login`. Email is `ADMIN_EMAIL` (default `alex@phoenixwebhost.com`). Set `ADMIN_PASSWORD` in `.env.local` / Vercel — do not commit a real password. If `RESEND_API_KEY` or complete Twilio vars are set, a 6-digit code is sent to `NOTIFY_EMAIL` / `NOTIFY_PHONE` after the password. If neither provider is configured, the owner session is issued after the password (same as before). `AUTH_SECRET` must be a long random string in production; it signs the login cookie.

Demo data is seeded automatically (4 clients in test mode). `Reset demo data` on the dashboard restores it.

## Environment variables

Copy `.env.example` to `.env.local`. Do not commit secrets.

| Variable | Required | Purpose |
| --- | --- | --- |
| `ADMIN_EMAIL` | yes (has default) | Alex’s login |
| `ADMIN_PASSWORD` | yes (has default) | Owner password — set in env, do not commit a real one |
| `AUTH_SECRET` | yes in production | Signs the login cookie. Use a long random string |
| `NEXT_PUBLIC_SITE_URL` | yes | Public URL, used in Stripe redirects |
| `NEXT_PUBLIC_ROOT_DOMAIN` | no | Default `phoenixwebhost.com` |
| `STRIPE_SECRET_KEY` | for payments | `sk_test_...` then `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | for payments | `whsec_...` from the webhook endpoint |
| `STRIPE_SETUP_PRICE_ID` | for payments | One-time **$200** price |
| `STRIPE_MONTHLY_PRICE_ID` | for payments | Recurring **$69/month** price |
| `STRIPE_BOOST_SETUP_PRICE_ID` | for Local Boost | One-time **$99** add-on price |
| `STRIPE_BOOST_MONTHLY_PRICE_ID` | for Local Boost | Recurring **$79/month** add-on price |
| `STRIPE_EMAIL_SETUP_PRICE_ID` | for Business Email | One-time **$49** add-on price (`price_1U8w4XIqJ6FpMcHxzsvfy4Ox` in test) |
| `STRIPE_EMAIL_MONTHLY_PRICE_ID` | for Business Email | Recurring **$19/month** add-on price (`price_1U8w4YIqJ6FpMcHx43X3F2gt` in test) |
| `DATABASE_URL` | production on Vercel | Postgres (Neon). Without it, data is local-file or ephemeral |
| `CRON_SECRET` | recommended | Protects `/api/cron/billing` |
| `NOTIFY_EMAIL` | no | Owner alert inbox. Default `ochoa.alejandro2@gmail.com` |
| `NOTIFY_PHONE` | no | Owner SMS number. Default `+14809532393` |
| `RESEND_API_KEY` | for email alerts | Resend API key. Email is skipped if unset |
| `RESEND_FROM` | no | From address. Default `onboarding@resend.dev` |
| `TWILIO_ACCOUNT_SID` | for SMS alerts | Twilio account SID. SMS is skipped if any Twilio var is unset |
| `TWILIO_AUTH_TOKEN` | for SMS alerts | Twilio auth token |
| `TWILIO_FROM` | for SMS alerts | Twilio from number (E.164, e.g. `+1…`) |
| `BLOB_READ_WRITE_TOKEN` | for tax portal uploads | Vercel Blob token. Private files only. Uploads fail closed if missing |
| `HOLA_TAX_STAFF_EMAIL` | no | Staff email bootstrap for Hola Tax Service. Default `ochoa.alejandro2@gmail.com` |
| `HOLA_TAX_STAFF_PASSWORD` | for Hola Tax staff login | Staff password for that one shop. Separate from `ADMIN_PASSWORD`. Other tax-office clients set staff in Admin |

Local data is saved to `data/store.json`. On Vercel, set `DATABASE_URL` (Neon or any Postgres) so client records survive deploys. The owner panel shows a warning if that URL is missing.

## Stripe (test mode, then live)

Alex already has a Stripe account. Use **test mode** until checkout works end to end.

1. [Stripe Dashboard](https://dashboard.stripe.com) → Developers → API keys → copy the **test** secret key into `STRIPE_SECRET_KEY`.
2. Create prices (Dashboard or script):

```bash
node --env-file=.env.local scripts/setup-stripe.mjs
```

That prints `STRIPE_SETUP_PRICE_ID` ($200 one-time) and `STRIPE_MONTHLY_PRICE_ID` ($69/month). Put both in `.env.local`. Local Boost uses the existing test prices `STRIPE_BOOST_SETUP_PRICE_ID` ($99) and `STRIPE_BOOST_MONTHLY_PRICE_ID` ($79/month). Business Email uses the existing test prices `STRIPE_EMAIL_SETUP_PRICE_ID` ($49) and `STRIPE_EMAIL_MONTHLY_PRICE_ID` ($19/month). Set those env names on Vercel; do not create extra price IDs.

3. Webhook (local):

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Paste the `whsec_...` into `STRIPE_WEBHOOK_SECRET`.

4. Production webhook: Stripe Dashboard → Add endpoint  
   `https://phoenixwebhost.com/api/stripe/webhook`  
   Events: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`.

**Test card:** `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP.

To test a failed payment / unpaid flow: card `4000 0000 0000 9995`, or in the owner panel open a client and click **Simulate unpaid** → **Apply unpaid policy** (after the 2-day grace, or it will set overdue immediately and offline when grace has passed). Mesa Street Kitchen is already overdue and offline.

Checkout charges **$200 launch + $69/month** in one Stripe Checkout session (subscription mode with a one-time line item). If the customer selects **Local Boost**, the same session also includes **$99 setup + $79/month**. If they select **Business Email**, it also includes **$49 setup + $19/month**. Leaving an add-on unchecked still charges only the base plan (and any other checked add-on). If an add-on’s price env vars are missing, checkout fails closed with a clear error instead of charging a partial cart.

When you are ready for real charges, switch the same variable names to **live** keys (`sk_live_...`, live price IDs, live webhook secret). Never mix test and live IDs.

## Owner panel

`/admin` after login.

- Every client: name, URL, live/offline, last payment, next invoice, paid vs overdue, whether they bought Local Boost or Business Email
- Client detail: notes, this month’s edit requests (capped at 2 requests / 30 minutes), Stripe customer and subscription IDs, Local Boost and Business Email status, pause / offline toggle. Existing clients can add Boost or Business Email later from this page.
- **New client** generates a site from a template (contractor, salon, restaurant, professional services, landscaping, tax office). Tax office includes a private client document portal on that site only.
- Public “Request a site” form lands under **Requests**. After a save, Alex also gets an email (`NOTIFY_EMAIL` / Resend) and a text (`NOTIFY_PHONE` / Twilio) so he can call them right away. Missing provider keys skip that channel; the form still succeeds.
- Public **Reviews** (`/reviews`, also on the homepage) stay pending until Alex approves them under **Reviews**. Same email + SMS on submit. No fake reviews are seeded.
- Owner login uses 2-step verification when Resend or Twilio is configured: password, then a 6-digit code emailed and texted. If those keys are missing, a valid password signs in immediately. Public visitors are not asked for a code.

## Generated client sites

- Path: `https://phoenixwebhost.com/s/{slug}`
- Subdomain (after DNS): `https://{slug}.phoenixwebhost.com`

**New client** in the panel: business name, phone, hours, copy, template → site is generated immediately.

The contact form on a live `/s/{slug}` site emails the address stored on that client record, and sends a copy to the owner (`NOTIFY_EMAIL` / Resend, plus SMS via `NOTIFY_PHONE` if Twilio is set). It does not send on page views — only on a real form submit. If the client has no email, the visitor sees a clear error and is asked to call. Inquiries are stored on the client in Admin. Demo records use `.example` addresses that will not deliver until you put a real inbox on the client.

Unpaid / paused sites render the “temporarily offline” page. After 30 days they are taken down.

## Tax office template

The **Tax office** template is a sellable Phoenixwebhost layout (white / black / neon) plus a private document drop box for that shop’s tax customers. It is not tax-prep software.

- Public site: `/s/{slug}` (custom domain works the same way as other clients)
- Client login / upload: `/s/{slug}/portal`
- Staff login: `/s/{slug}/portal/staff/login` — that shop’s folders only
- Customers of shop A cannot see shop B. Staff of shop A cannot see shop B.
- Files go to Vercel Blob with **private** access. Downloads require a signed-in session. Nothing is stored in git or `/public`.
- Needs `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN`. If either is missing, the portal fails closed and will not take uploads.
- Create a tax-office client in Admin, then set the staff email/password on that client. Do not reuse the Phoenixwebhost owner password.
- Hola Tax Service (`hola-tax-service`, www.hola-tax-service.com) is the first live example. Its staff login can also be bootstrapped with `HOLA_TAX_STAFF_EMAIL` / `HOLA_TAX_STAFF_PASSWORD`.

## Custom domain (CNAME)

1. Customer creates a CNAME at their DNS host:

```
www.theirshop.com    CNAME    cname.vercel-dns.com
```

(If they use the root domain, use an ALIAS/ANAME to `cname.vercel-dns.com`, or CNAME flattening at Cloudflare.)

2. In Vercel → Project → Domains, add `www.theirshop.com`.
3. In the owner panel, set the client’s **Custom domain** to `www.theirshop.com`.

The app maps that host to the generated site. Also add a wildcard domain `*.phoenixwebhost.com` in Vercel so `desert-peak-roofing.phoenixwebhost.com` works without extra setup.

## Deploy to Vercel

1. Push this GitHub repo (`ochoaalejandro2-web/phoenixwebhost`).
2. [vercel.com/new](https://vercel.com/new) → import **phoenixwebhost** (this repo only — do not attach any other project).
3. Framework: Next.js. Build command `next build`.
4. Add the environment variables from the table above (start with **test** Stripe keys).
5. Deploy.
6. Project → Settings → Domains:
   - `phoenixwebhost.com`
   - `www.phoenixwebhost.com` (redirect to apex or vice versa)
   - `*.phoenixwebhost.com` (wildcard for client subdomains)
7. At the domain registrar, point the domain:

```
A      @      76.76.21.21
CNAME  www    cname.vercel-dns.com
```

   Or use Vercel’s nameservers if you prefer.

8. Set `NEXT_PUBLIC_SITE_URL=https://phoenixwebhost.com`.
9. Add `DATABASE_URL` from [Neon](https://neon.tech) (or Vercel Marketplace → Neon) so the owner panel keeps clients after deploys.
10. Stripe live webhook → `https://phoenixwebhost.com/api/stripe/webhook`.

Daily cron `/api/cron/billing` applies the unpaid policy (offline after grace, take down after 30 days). If you set `CRON_SECRET`, configure the cron Authorization header in Vercel, or call:

```
curl -H "Authorization: Bearer $CRON_SECRET" https://phoenixwebhost.com/api/cron/billing
```

## Stack

Next.js (App Router), TypeScript, Tailwind, Stripe Checkout + webhooks, signed cookie auth for Alex, JSON store locally / Postgres when `DATABASE_URL` is set.
