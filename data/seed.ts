import type { AppState, Client } from "@/lib/types";
import { monthKey } from "@/lib/slug";

function isoDaysFromNow(days: number) {
  return new Date(Date.now() + days * 86_400_000).toISOString();
}

function demoClients(): Client[] {
  const thisMonth = monthKey();
  return [
    {
      id: "cli_desert_peak",
      businessName: "Desert Peak Roofing",
      slug: "desert-peak-roofing",
      contactName: "Marco Diaz",
      email: "marco@desertpeakroofing.example",
      phone: "(480) 555-0142",
      address: "2140 E Broadway Rd",
      city: "Tempe, AZ",
      hours: "Mon–Fri 7:00am–5:00pm",
      tagline: "Roofs that hold up to Arizona sun.",
      about:
        "Desert Peak Roofing is a Tempe crew that repairs, replaces, and inspects residential roofs across the East Valley. We show up when we say we will, leave the job site clean, and put every bid in writing.",
      services: [
        "Roof replacement",
        "Leak repair",
        "Tile and shingle",
        "Free inspections",
      ],
      template: "contractor",
      customDomain: null,
      siteStatus: "live",
      paymentStatus: "paid",
      lastPaymentAt: isoDaysFromNow(-11),
      nextInvoiceAt: isoDaysFromNow(19),
      stripeCustomerId: "cus_demo_desertpeak",
      stripeSubscriptionId: "sub_demo_desertpeak",
      reminderSentAt: null,
      overdueSince: null,
      offlineAt: null,
      filesKeptUntil: null,
      takenDownAt: null,
      notes: [
        {
          id: "note_dp_1",
          body: "Prefers calls before 3pm. Spanish-speaking office manager on Fridays.",
          createdAt: isoDaysFromNow(-20),
        },
      ],
      editRequests: [
        {
          id: "ed_dp_1",
          month: thisMonth,
          body: "Update Saturday emergency line on the homepage.",
          minutes: 10,
          status: "done",
          createdAt: isoDaysFromNow(-6),
        },
      ],
      createdAt: isoDaysFromNow(-80),
    },
    {
      id: "cli_casa_luna",
      businessName: "Casa Luna Salon",
      slug: "casa-luna-salon",
      contactName: "Elena Ruiz",
      email: "elena@casalunasalon.example",
      phone: "(480) 555-0198",
      address: "7349 E Shea Blvd",
      city: "Scottsdale, AZ",
      hours: "Tue–Sat 9:00am–7:00pm",
      tagline: "Color, cuts, and calm in Scottsdale.",
      about:
        "Casa Luna is a small Scottsdale salon for color, cuts, and bridal work. We keep the chairs unhurried and the books honest — if we are full, we will say so.",
      services: ["Color", "Cuts", "Blowouts", "Bridal styling"],
      template: "salon",
      customDomain: null,
      siteStatus: "live",
      paymentStatus: "paid",
      lastPaymentAt: isoDaysFromNow(-4),
      nextInvoiceAt: isoDaysFromNow(26),
      stripeCustomerId: "cus_demo_casaluna",
      stripeSubscriptionId: "sub_demo_casaluna",
      reminderSentAt: null,
      overdueSince: null,
      offlineAt: null,
      filesKeptUntil: null,
      takenDownAt: null,
      notes: [
        {
          id: "note_cl_1",
          body: "Monthly note sent: confirmed hours for summer (close at 6pm in July).",
          createdAt: isoDaysFromNow(-3),
        },
      ],
      editRequests: [
        {
          id: "ed_cl_1",
          month: thisMonth,
          body: "Swap homepage photo with the one Elena texted.",
          minutes: 12,
          status: "open",
          createdAt: isoDaysFromNow(-1),
        },
      ],
      createdAt: isoDaysFromNow(-52),
    },
    {
      id: "cli_mesa_street",
      businessName: "Mesa Street Kitchen",
      slug: "mesa-street-kitchen",
      contactName: "Priya Shah",
      email: "priya@mesastreetkitchen.example",
      phone: "(480) 555-0177",
      address: "125 W Main St",
      city: "Mesa, AZ",
      hours: "Daily 11:00am–9:00pm",
      tagline: "Neighborhood plates, from scratch.",
      about:
        "Mesa Street Kitchen is a family restaurant on Main Street. We cook from scratch, keep a short seasonal menu, and save the patio tables for walk-ins after 5.",
      services: ["Lunch plates", "Dinner", "Patio", "Catering trays"],
      template: "restaurant",
      customDomain: null,
      siteStatus: "offline",
      paymentStatus: "overdue",
      lastPaymentAt: isoDaysFromNow(-41),
      nextInvoiceAt: isoDaysFromNow(-11),
      stripeCustomerId: "cus_demo_mesastreet",
      stripeSubscriptionId: "sub_demo_mesastreet",
      reminderSentAt: isoDaysFromNow(-9),
      overdueSince: isoDaysFromNow(-9),
      offlineAt: isoDaysFromNow(-7),
      filesKeptUntil: isoDaysFromNow(21),
      takenDownAt: null,
      notes: [
        {
          id: "note_ms_1",
          body: "Card failed. Reminder emailed. Site set to temporarily offline after grace period.",
          createdAt: isoDaysFromNow(-7),
        },
      ],
      editRequests: [],
      createdAt: isoDaysFromNow(-120),
    },
  ];
}

export function createSeedState(): AppState {
  return {
    clients: demoClients(),
    leads: [
      {
        id: "lead_demo_1",
        name: "Luis Ortega",
        businessName: "Ortega Landscaping",
        email: "luis@ortegalandscaping.example",
        phone: "(623) 555-0114",
        city: "Glendale, AZ",
        message:
          "Need a simple site with our phone, service list, and a form. English and Spanish if possible.",
        locale: "es",
        createdAt: isoDaysFromNow(-2),
      },
    ],
    contactMessages: [],
    reviews: [],
    authLock: {
      passwordFails: 0,
      passwordLockedUntil: null,
      codeFails: 0,
      codeLockedUntil: null,
      lastCodeSentAt: null,
      consumedNonces: [],
    },
    seededAt: new Date().toISOString(),
  };
}
