import type { Locale, TemplateId } from "./types";

export type ShopPhoto = {
  src: string;
  alt: string;
  altEs: string;
};

export type ShopTheme = {
  page: string;
  header: string;
  headerBorder: string;
  name: string;
  nav: string;
  call: string;
  callHover: string;
  kicker: string;
  body: string;
  muted: string;
  card: string;
  cardBorder: string;
  sectionTitle: string;
  overlay: string;
  heroTitle?: string;
  heroLead?: string;
  footer: string;
  footerBorder: string;
  field: string;
  ghostBtn: string;
};

export const SHOP_PHOTOS: Record<TemplateId, {
  hero: ShopPhoto;
  gallery: ShopPhoto[];
}> = {
  contractor: {
    hero: {
      src: "/templates/contractor/hero.jpg",
      alt: "Crew finishing a concrete pour on a job site",
      altEs: "Cuadrilla terminando una colada de concreto en la obra",
    },
    gallery: [
      {
        src: "/templates/contractor/photo-1.jpg",
        alt: "Framing and construction on a Phoenix-area home",
        altEs: "Estructura y construcción en una casa del área de Phoenix",
      },
      {
        src: "/templates/contractor/photo-2.jpg",
        alt: "Tools and materials ready for the day’s work",
        altEs: "Herramientas y materiales listos para el día",
      },
      {
        src: "/templates/contractor/photo-3.jpg",
        alt: "An active construction site",
        altEs: "Una obra en marcha",
      },
      {
        src: "/templates/contractor/photo-4.jpg",
        alt: "A tradesperson on the job with a tool belt",
        altEs: "Un trabajador en la obra con cinturón de herramientas",
      },
    ],
  },
  handyman: {
    hero: {
      src: "/templates/handyman/hero.jpg",
      alt: "Crew cutting trim inside a Phoenix-area home",
      altEs: "Cuadrilla cortando moldura dentro de una casa del área de Phoenix",
    },
    gallery: [
      {
        src: "/templates/handyman/photo-1.jpg",
        alt: "Handyman on a drywall repair job",
        altEs: "Manitas en un trabajo de tablaroca",
      },
      {
        src: "/templates/handyman/photo-2.jpg",
        alt: "Interior painting after wall prep",
        altEs: "Pintura interior después de preparar la pared",
      },
      {
        src: "/templates/handyman/photo-3.jpg",
        alt: "Finished bathroom fixtures and tile",
        altEs: "Accesorios y azulejo de baño terminados",
      },
      {
        src: "/templates/handyman/photo-4.jpg",
        alt: "Odd-job assembly with a drill on the floor",
        altEs: "Armado de un trabajo varios con taladro en el piso",
      },
    ],
  },
  carpentry: {
    hero: {
      src: "/templates/carpentry/hero.jpg",
      alt: "Walnut kitchen cabinets and a custom dining table",
      altEs: "Gabinetes de cocina de nogal y una mesa a medida",
    },
    gallery: [
      {
        src: "/templates/carpentry/photo-1.jpg",
        alt: "Custom built-in breakfast nook and millwork",
        altEs: "Rincón de desayuno a medida y millwork",
      },
      {
        src: "/templates/carpentry/photo-2.jpg",
        alt: "Built-in bookcases and a custom credenza",
        altEs: "Libreros empotrados y una credenza a medida",
      },
      {
        src: "/templates/carpentry/photo-3.jpg",
        alt: "Shop craft — drilling millwork on the bench",
        altEs: "Trabajo de taller — taladrando millwork en el banco",
      },
      {
        src: "/templates/carpentry/photo-4.jpg",
        alt: "Walnut wall millwork in a finished bedroom",
        altEs: "Millwork de nogal en un recámara terminada",
      },
    ],
  },
  salon: {
    hero: {
      src: "/templates/salon/hero.jpg",
      alt: "Stylist washing a client’s hair at the salon bowl",
      altEs: "Estilista lavando el cabello de una clienta en el lavacabezas",
    },
    gallery: [
      {
        src: "/templates/salon/photo-1.jpg",
        alt: "Stylist draping a client in the salon chair",
        altEs: "Estilista colocando la capa a una clienta en el sillón",
      },
      {
        src: "/templates/salon/photo-2.jpg",
        alt: "Hair being styled in the chair",
        altEs: "Peinado en el sillón",
      },
      {
        src: "/templates/salon/photo-3.jpg",
        alt: "Salon station with tools and product",
        altEs: "Estación del salón con herramientas y producto",
      },
      {
        src: "/templates/salon/photo-4.jpg",
        alt: "Finished color and cut in the mirror",
        altEs: "Color y corte terminados en el espejo",
      },
    ],
  },
  restaurant: {
    hero: {
      src: "/templates/restaurant/hero.jpg",
      alt: "Server bringing plates out of the kitchen",
      altEs: "Mesero sacando platos de la cocina",
    },
    gallery: [
      {
        src: "/templates/restaurant/photo-1.jpg",
        alt: "A plated dish ready for the table",
        altEs: "Un plato listo para la mesa",
      },
      {
        src: "/templates/restaurant/photo-2.jpg",
        alt: "Dining room set for guests",
        altEs: "Comedor preparado para los invitados",
      },
      {
        src: "/templates/restaurant/photo-3.jpg",
        alt: "Evening service in the restaurant",
        altEs: "Servicio de noche en el restaurante",
      },
      {
        src: "/templates/restaurant/photo-4.jpg",
        alt: "Kitchen plating during service",
        altEs: "Emplatado en la cocina durante el servicio",
      },
    ],
  },
  professional: {
    hero: {
      src: "/templates/professional/hero.jpg",
      alt: "A working meeting around plans and notes",
      altEs: "Una reunión de trabajo con planes y notas",
    },
    gallery: [
      {
        src: "/templates/professional/photo-1.jpg",
        alt: "Team conversation in the office",
        altEs: "Conversación de equipo en la oficina",
      },
      {
        src: "/templates/professional/photo-2.jpg",
        alt: "A quiet office ready for clients",
        altEs: "Una oficina tranquila lista para clientes",
      },
      {
        src: "/templates/professional/photo-3.jpg",
        alt: "Desk work with a laptop and papers",
        altEs: "Trabajo de escritorio con laptop y papeles",
      },
      {
        src: "/templates/professional/photo-4.jpg",
        alt: "Clients talking through next steps",
        altEs: "Clientes hablando de los siguientes pasos",
      },
    ],
  },
  landscaping: {
    hero: {
      src: "/templates/landscaping/hero.jpg",
      alt: "Desert succulents in a rock garden",
      altEs: "Suculentas del desierto en un jardín de piedra",
    },
    gallery: [
      {
        src: "/templates/landscaping/photo-1.jpg",
        alt: "Front yard with a clean lawn and planting beds",
        altEs: "Patio delantero con césped y camas de plantas",
      },
      {
        src: "/templates/landscaping/photo-2.jpg",
        alt: "Garden beds and outdoor planting",
        altEs: "Camas de jardín y plantación exterior",
      },
      {
        src: "/templates/landscaping/photo-3.jpg",
        alt: "Lush planting around a home",
        altEs: "Plantación abundante alrededor de una casa",
      },
      {
        src: "/templates/landscaping/photo-4.jpg",
        alt: "Curb appeal at dusk after yard work",
        altEs: "Fachada al atardecer después del trabajo de jardín",
      },
    ],
  },
  tax: {
    hero: {
      src: "/templates/tax/hero.jpg",
      alt: "Tax forms, a calculator, and a pen on the desk",
      altEs: "Formularios de impuestos, una calculadora y un bolígrafo en el escritorio",
    },
    gallery: [
      {
        src: "/templates/tax/photo-1.jpg",
        alt: "Tax paperwork ready for preparation",
        altEs: "Papeles de impuestos listos para preparar",
      },
      {
        src: "/templates/tax/photo-2.jpg",
        alt: "Calculator and receipts on the desk",
        altEs: "Calculadora y recibos en el escritorio",
      },
      {
        src: "/templates/tax/photo-3.jpg",
        alt: "Laptop, phone, and files during tax season",
        altEs: "Laptop, teléfono y archivos en temporada de impuestos",
      },
      {
        src: "/templates/tax/photo-4.jpg",
        alt: "A tidy tax-office desk",
        altEs: "Un escritorio ordenado de oficina de impuestos",
      },
    ],
  },
};

export const SHOP_THEMES: Record<Exclude<TemplateId, "tax">, ShopTheme> = {
  contractor: {
    page: "bg-white text-ink-black",
    header: "bg-white/95 text-ink-black",
    headerBorder: "border-zinc-200",
    name: "text-ink-black",
    nav: "text-body hover:text-ink-black",
    call: "bg-lime text-white",
    callHover: "hover:bg-lime-deep",
    kicker: "text-lime",
    body: "text-ink-black",
    muted: "text-body",
    card: "bg-white",
    cardBorder: "border-zinc-200",
    sectionTitle: "text-ink-black",
    overlay: "bg-gradient-to-r from-white via-white/85 to-white/25",
    heroTitle: "text-ink-black",
    heroLead: "text-body",
    footer: "text-body",
    footerBorder: "border-zinc-200",
    field: "rounded-lg border border-zinc-200 bg-white px-3 py-2 text-ink-black",
    ghostBtn: "border border-zinc-300 text-ink-black hover:bg-zinc-50",
  },
  handyman: {
    page: "bg-[#f6f3ec] text-[#171717]",
    header: "bg-[#111111]/95 text-[#f6f3ec]",
    headerBorder: "border-white/10",
    name: "text-[#f6f3ec]",
    nav: "text-white/70 hover:text-white",
    call: "bg-[#00c851] text-[#111111]",
    callHover: "hover:bg-[#00b348]",
    kicker: "text-[#d4e8a0]",
    body: "text-[#171717]",
    muted: "text-[#4a4740]",
    card: "bg-white",
    cardBorder: "border-[#e4dfd4]",
    sectionTitle: "text-[#171717]",
    overlay: "bg-gradient-to-r from-black/80 via-black/50 to-black/15",
    footer: "text-[#5c574e]",
    footerBorder: "border-[#e4dfd4]",
    field: "rounded-lg border border-[#e4dfd4] bg-white px-3 py-2 text-ink",
    ghostBtn: "border border-white/80 text-white hover:bg-white hover:text-[#111111]",
  },
  carpentry: {
    page: "bg-[#f7f5f0] text-[#111111]",
    header: "bg-[#111111]/95 text-[#f7f5f0]",
    headerBorder: "border-white/10",
    name: "text-[#f7f5f0]",
    nav: "text-white/70 hover:text-white",
    call: "bg-[#00c851] text-[#111111]",
    callHover: "hover:bg-[#00b348]",
    kicker: "text-[#c8f0c0]",
    body: "text-[#111111]",
    muted: "text-[#4a4740]",
    card: "bg-white",
    cardBorder: "border-[#e6e1d6]",
    sectionTitle: "text-[#111111]",
    overlay: "bg-gradient-to-r from-black/80 via-black/50 to-black/15",
    footer: "text-[#5c574e]",
    footerBorder: "border-[#e6e1d6]",
    field: "rounded-lg border border-[#e6e1d6] bg-white px-3 py-2 text-ink",
    ghostBtn: "border border-white/80 text-white hover:bg-white hover:text-[#111111]",
  },
  salon: {
    page: "bg-[#fffaf6] text-[#1c1712]",
    header: "bg-[#fffaf6]/95 text-[#1c1712]",
    headerBorder: "border-[#eadfd4]",
    name: "text-[#1c1712]",
    nav: "text-[#5c534c] hover:text-[#1c1712]",
    call: "bg-[#9c4a6a] text-white",
    callHover: "hover:bg-[#833d59]",
    kicker: "text-[#c4a484]",
    body: "text-[#1c1712]",
    muted: "text-[#5c534c]",
    card: "bg-white",
    cardBorder: "border-[#eadfd4]",
    sectionTitle: "text-[#1c1712]",
    overlay: "bg-gradient-to-r from-black/75 via-black/45 to-black/15",
    footer: "text-[#5c534c]",
    footerBorder: "border-[#eadfd4]",
    field: "rounded-lg border border-[#eadfd4] bg-white px-3 py-2 text-ink",
    ghostBtn: "border border-white/80 text-white hover:bg-white hover:text-[#1c1712]",
  },
  restaurant: {
    page: "bg-[#f7efe4] text-[#2a1f19]",
    header: "bg-[#3a2a22]/95 text-[#f7efe4]",
    headerBorder: "border-white/10",
    name: "text-[#f7efe4]",
    nav: "text-white/75 hover:text-white",
    call: "bg-[#c45c26] text-white",
    callHover: "hover:bg-[#a94c1e]",
    kicker: "text-[#d7b48a]",
    body: "text-[#2a1f19]",
    muted: "text-[#5c534c]",
    card: "bg-white",
    cardBorder: "border-[#e4dccf]",
    sectionTitle: "text-[#2a1f19]",
    overlay: "bg-gradient-to-r from-black/80 via-black/50 to-black/15",
    footer: "text-[#5c534c]",
    footerBorder: "border-[#e4dccf]",
    field: "rounded-lg border border-[#e4dccf] bg-white px-3 py-2 text-ink",
    ghostBtn: "border border-white/80 text-white hover:bg-white hover:text-[#3a2a22]",
  },
  professional: {
    page: "bg-[#f6f8f7] text-[#1c1914]",
    header: "bg-white/95 text-[#1c1914]",
    headerBorder: "border-[#d8e0db]",
    name: "text-[#1c1914]",
    nav: "text-[#4a534c] hover:text-[#1c1914]",
    call: "bg-[#3d5a4c] text-white",
    callHover: "hover:bg-[#31483d]",
    kicker: "text-[#3d5a4c]",
    body: "text-[#1c1914]",
    muted: "text-[#5c564c]",
    card: "bg-white",
    cardBorder: "border-[#d8e0db]",
    sectionTitle: "text-[#1c1914]",
    overlay: "bg-gradient-to-r from-black/75 via-black/45 to-black/20",
    footer: "text-[#5c564c]",
    footerBorder: "border-[#d8e0db]",
    field: "rounded-lg border border-[#d8e0db] bg-white px-3 py-2 text-ink",
    ghostBtn: "border border-white/80 text-white hover:bg-white hover:text-[#1c1914]",
  },
  landscaping: {
    page: "bg-[#f3efe4] text-[#1d241c]",
    header: "bg-[#f7f3e8]/95 text-[#1d241c]",
    headerBorder: "border-[#d7d0be]",
    name: "text-[#1d241c]",
    nav: "text-[#4a5346] hover:text-[#1d241c]",
    call: "bg-[#2f4a38] text-[#f4efe6]",
    callHover: "hover:bg-[#24382b]",
    kicker: "text-[#d5e4c9]",
    body: "text-[#1d241c]",
    muted: "text-[#4a5346]",
    card: "bg-[#fbf8f0]",
    cardBorder: "border-[#d7d0be]",
    sectionTitle: "text-[#1d241c]",
    overlay: "bg-gradient-to-r from-black/75 via-black/45 to-black/15",
    footer: "text-[#4a5346]",
    footerBorder: "border-[#d7d0be]",
    field: "rounded-lg border border-[#d7d0be] bg-white px-3 py-2 text-ink",
    ghostBtn: "border border-white/80 text-white hover:bg-white hover:text-[#2f4a38]",
  },
};

export const SERVICE_BLURBS: Record<
  string,
  { blurb: string; blurbEs: string; nameEs: string }
> = {
  "Roof repair": {
    nameEs: "Reparación de techos",
    blurb: "Leaks, missing tile, and monsoon damage — written bids before we start.",
    blurbEs: "Goteras, teja faltante y daño de monzón — presupuesto por escrito antes de empezar.",
  },
  "Roof replacement": {
    nameEs: "Reemplazo de techos",
    blurb: "Full tear-off and new roofs built for Arizona sun.",
    blurbEs: "Desmonte completo y techos nuevos hechos para el sol de Arizona.",
  },
  "Tile and shingle": {
    nameEs: "Teja y shingle",
    blurb: "Clay, concrete, and shingle work matched to the house.",
    blurbEs: "Trabajo de teja de barro, concreto y shingle acorde a la casa.",
  },
  "Leak inspection": {
    nameEs: "Inspección de goteras",
    blurb: "We find the leak, show you photos, and put the fix in writing.",
    blurbEs: "Encontramos la gotera, le mostramos fotos y dejamos el arreglo por escrito.",
  },
  "Free estimates": {
    nameEs: "Presupuestos gratis",
    blurb: "No surprise invoices. You get a number before the crew arrives.",
    blurbEs: "Sin facturas sorpresa. Recibe un número antes de que llegue la cuadrilla.",
  },
  "Emergency calls": {
    nameEs: "Llamadas de emergencia",
    blurb: "Storm tarps and same-week leak calls when the weather hits.",
    blurbEs: "Lonas por tormenta y llamadas de goteras en la misma semana.",
  },
  "Home repairs": {
    nameEs: "Reparaciones del hogar",
    blurb: "Doors that stick, outlets that fail, and the small jobs that pile up.",
    blurbEs: "Puertas que traban, contactos que fallan y los trabajos chicos que se juntan.",
  },
  Drywall: {
    nameEs: "Tablaroca",
    blurb: "Holes, seams, and texture matched before paint goes on.",
    blurbEs: "Hoyos, juntas y textura igualada antes de pintar.",
  },
  "Interior painting": {
    nameEs: "Pintura interior",
    blurb: "Rooms, trim, and clean edges — we cover floors before we roll.",
    blurbEs: "Cuartos, molduras y orillas limpias — cubrimos el piso antes de pintar.",
  },
  "Fixture install": {
    nameEs: "Instalación de accesorios",
    blurb: "Lights, faucets, and hardware you already bought, put in right.",
    blurbEs: "Luces, llaves y herrajes que ya compró, instalados bien.",
  },
  "Odd jobs": {
    nameEs: "Trabajos varios",
    blurb: "Mounting, assembly, and the one-off fix that is not a full remodel.",
    blurbEs: "Colgar, armar y el arreglo suelto que no es una remodelación.",
  },
  "Punch-list fixes": {
    nameEs: "Detalles y remates",
    blurb: "A written list, then we knock it down. No mystery extras.",
    blurbEs: "Una lista por escrito, y la vamos tachando. Sin extras misteriosos.",
  },
  "Custom cabinets": {
    nameEs: "Gabinetes a medida",
    blurb: "Walnut, white oak, and painted cabinets fitted to the room — not catalog boxes.",
    blurbEs: "Gabinetes de nogal, roble blanco y pintados, a la medida del cuarto — no cajas de catálogo.",
  },
  "Built-ins": {
    nameEs: "Muebles empotrados",
    blurb: "Bookcases, benches, and wall units scribed to the plaster and the floor.",
    blurbEs: "Libreros, bancas y muros empotrados ajustados al yeso y al piso.",
  },
  Furniture: {
    nameEs: "Muebles",
    blurb: "Tables, desks, and pieces made in the shop for one house.",
    blurbEs: "Mesas, escritorios y piezas hechas en el taller para una casa.",
  },
  "Trim and millwork": {
    nameEs: "Molduras y millwork",
    blurb: "Doors, casing, and finish millwork that matches the rest of the room.",
    blurbEs: "Puertas, marcos y millwork de acabado que coinciden con el resto del cuarto.",
  },
  Residential: {
    nameEs: "Residencial",
    blurb: "Kitchens, closets, and rooms in Phoenix-area homes.",
    blurbEs: "Cocinas, closets y cuartos en casas del área de Phoenix.",
  },
  Commercial: {
    nameEs: "Comercial",
    blurb: "Offices, restaurants, and shops that need real millwork, not laminate kits.",
    blurbEs: "Oficinas, restaurantes y tiendas que necesitan millwork de verdad, no kits de laminado.",
  },
  Haircuts: {
    nameEs: "Cortes",
    blurb: "Cuts that fit the hair you have, not a catalog photo.",
    blurbEs: "Cortes para el cabello que tiene, no para una foto de catálogo.",
  },
  Color: {
    nameEs: "Color",
    blurb: "Color, highlights, and gloss without rushing the chair.",
    blurbEs: "Color, luces y brillo sin apurar el sillón.",
  },
  Blowouts: {
    nameEs: "Peinados y blowouts",
    blurb: "Wash, blowout, and styling for the week or a night out.",
    blurbEs: "Lavado, blowout y peinado para la semana o una noche.",
  },
  "Bridal styling": {
    nameEs: "Estilo nupcial",
    blurb: "Trial runs and wedding-day hair, booked on the calendar.",
    blurbEs: "Pruebas y peinado de boda, agendados en el calendario.",
  },
  Treatments: {
    nameEs: "Tratamientos",
    blurb: "Deep condition, gloss, and scalp care between color visits.",
    blurbEs: "Tratamiento, brillo y cuidado del cuero cabelludo entre visitas de color.",
  },
  Appointments: {
    nameEs: "Citas",
    blurb: "Call to book. If we are full, we will say so.",
    blurbEs: "Llame para agendar. Si estamos llenos, se lo decimos.",
  },
  "Lunch plates": {
    nameEs: "Platos de almuerzo",
    blurb: "A short lunch menu, cooked from scratch.",
    blurbEs: "Un menú corto de almuerzo, cocinado desde cero.",
  },
  Dinner: {
    nameEs: "Cena",
    blurb: "Evening plates and a few specials that change with the week.",
    blurbEs: "Platos de noche y unos especiales que cambian con la semana.",
  },
  Patio: {
    nameEs: "Patio",
    blurb: "Shade, fans, and walk-in tables after 5 when we can.",
    blurbEs: "Sombra, ventiladores y mesas sin reserva después de las 5 cuando se puede.",
  },
  "Catering trays": {
    nameEs: "Charolas para eventos",
    blurb: "Trays for offices and family parties — call a few days ahead.",
    blurbEs: "Charolas para oficinas y fiestas familiares — llame con unos días.",
  },
  "Weekend brunch": {
    nameEs: "Brunch de fin de semana",
    blurb: "Saturday and Sunday plates until mid-afternoon.",
    blurbEs: "Platos de sábado y domingo hasta media tarde.",
  },
  "Kids menu": {
    nameEs: "Menú infantil",
    blurb: "Simple plates so the whole table can eat.",
    blurbEs: "Platos sencillos para que coma toda la mesa.",
  },
  Consultations: {
    nameEs: "Consultas",
    blurb: "A first conversation about what you need, in plain language.",
    blurbEs: "Una primera conversación sobre lo que necesita, en lenguaje claro.",
  },
  Planning: {
    nameEs: "Planificación",
    blurb: "A written plan and next steps you can keep.",
    blurbEs: "Un plan por escrito y siguientes pasos que puede guardar.",
  },
  "Ongoing support": {
    nameEs: "Apoyo continuo",
    blurb: "Check-ins after the first meeting — not a one-and-done PDF.",
    blurbEs: "Seguimiento después de la primera cita — no un PDF de una sola vez.",
  },
  "Local service": {
    nameEs: "Servicio local",
    blurb: "Phoenix-area clients. We pick up the phone.",
    blurbEs: "Clientes del área de Phoenix. Contestamos el teléfono.",
  },
  Bookkeeping: {
    nameEs: "Contabilidad",
    blurb: "Monthly books so tax time is not a scramble.",
    blurbEs: "Libros mensuales para que la temporada de impuestos no sea un apuro.",
  },
  Paperwork: {
    nameEs: "Trámites",
    blurb: "Forms, filings, and follow-up without the runaround.",
    blurbEs: "Formularios, presentaciones y seguimiento sin vueltas.",
  },
  "Desert landscaping": {
    nameEs: "Jardinería del desierto",
    blurb: "Palo verde, cactus, and rock yards that live in this heat.",
    blurbEs: "Palo verde, cactus y patios de piedra que viven en este calor.",
  },
  "Lawn care": {
    nameEs: "Cuidado de césped",
    blurb: "Mow, edge, and seasonal feed without wasting water.",
    blurbEs: "Corte, orilla y abono de temporada sin desperdiciar agua.",
  },
  "Drip irrigation": {
    nameEs: "Riego por goteo",
    blurb: "Timers, drip lines, and repairs after monsoon season.",
    blurbEs: "Temporizadores, líneas de goteo y reparaciones después del monzón.",
  },
  Cleanup: {
    nameEs: "Limpieza",
    blurb: "Debris, trimmings, and a swept walk when we leave.",
    blurbEs: "Escombros, recortes y la banqueta barrida cuando nos vamos.",
  },
  "Rock and gravel yards": {
    nameEs: "Patios de piedra y grava",
    blurb: "Gravel, boulders, and low-water beds that stay tidy.",
    blurbEs: "Grava, piedras y camas de bajo riego que se mantienen ordenadas.",
  },
  "Tree and cactus care": {
    nameEs: "Cuidado de árboles y cactus",
    blurb: "Trimming and staking that does not fight the desert.",
    blurbEs: "Poda y tutorado que no pelea con el desierto.",
  },
  "Personal tax preparation": {
    nameEs: "Preparación de impuestos personales",
    blurb: "W-2, 1099, and family returns prepared in the office.",
    blurbEs: "Declaraciones W-2, 1099 y familiares preparadas en la oficina.",
  },
  "Small-business tax preparation": {
    nameEs: "Preparación de impuestos para negocios pequeños",
    blurb: "Schedule C and small-business filings without the software maze.",
    blurbEs: "Schedule C y declaraciones de negocio pequeño sin el laberinto de software.",
  },
  "ITIN applications": {
    nameEs: "Solicitudes de ITIN",
    blurb: "Help gathering the papers for an ITIN application.",
    blurbEs: "Ayuda para juntar los papeles de una solicitud de ITIN.",
  },
  "Year-round tax support": {
    nameEs: "Apoyo con impuestos todo el año",
    blurb: "Questions in July, not only in April.",
    blurbEs: "Preguntas en julio, no solo en abril.",
  },
  "Tax planning": {
    nameEs: "Planificación de impuestos",
    blurb: "A short plan for next year after this year’s return.",
    blurbEs: "Un plan corto para el año que viene después de esta declaración.",
  },
  "House cleaning": {
    nameEs: "Limpieza de casas",
    blurb: "Kitchens, baths, floors, and the rooms you use every week.",
    blurbEs: "Cocinas, baños, pisos y los cuartos que usa cada semana.",
  },
  "Office cleaning": {
    nameEs: "Limpieza de oficinas",
    blurb: "After-hours tidy for small offices and shops.",
    blurbEs: "Limpieza después del horario para oficinas y tiendas pequeñas.",
  },
  "Move-out clean": {
    nameEs: "Limpieza de mudanza",
    blurb: "A full clean so the next tenant or buyer walks into a finished room.",
    blurbEs: "Una limpieza completa para que el siguiente inquilino o comprador entre a un cuarto terminado.",
  },
  "Weekly service": {
    nameEs: "Servicio semanal",
    blurb: "A standing day each week. Same crew when we can.",
    blurbEs: "Un día fijo cada semana. La misma cuadrilla cuando se puede.",
  },
  "Deep clean": {
    nameEs: "Limpieza profunda",
    blurb: "Baseboards, appliances, and the jobs a weekly visit does not cover.",
    blurbEs: "Zócalos, aparatos y lo que una visita semanal no cubre.",
  },
  Windows: {
    nameEs: "Ventanas",
    blurb: "Interior glass and tracks. Exterior when the house allows it.",
    blurbEs: "Vidrio interior y rieles. El exterior cuando la casa lo permite.",
  },
  "Retail hours": {
    nameEs: "Horario de tienda",
    blurb: "Clear open hours on the site so people know when to come in.",
    blurbEs: "Horario claro en el sitio para que sepan cuándo entrar.",
  },
  "In-store pickup": {
    nameEs: "Recoger en tienda",
    blurb: "Call ahead, pick up at the counter. Not a full online shop.",
    blurbEs: "Llame antes y recoja en el mostrador. No es una tienda en línea completa.",
  },
  "Local products": {
    nameEs: "Productos locales",
    blurb: "What is on the shelf this week — said in plain words.",
    blurbEs: "Lo que hay en el estante esta semana — dicho en palabras claras.",
  },
  "Special orders": {
    nameEs: "Pedidos especiales",
    blurb: "We can order it if we do not have it. You get a real timeline.",
    blurbEs: "Lo podemos pedir si no lo tenemos. Le damos un plazo real.",
  },
  "Gift cards": {
    nameEs: "Tarjetas de regalo",
    blurb: "A card for the shop, sold at the counter.",
    blurbEs: "Una tarjeta de la tienda, vendida en el mostrador.",
  },
  "Customer help": {
    nameEs: "Ayuda al cliente",
    blurb: "A phone that answers and a person who knows the stock.",
    blurbEs: "Un teléfono que contesta y alguien que conoce el inventario.",
  },
};

export type SampleReview = {
  name: string;
  city: string;
  stars: 5 | 4;
  body: string;
  bodyEs: string;
};

export const DEMO_REVIEWS: Record<TemplateId, SampleReview[]> = {
  contractor: [
    {
      name: "Marco D.",
      city: "Tempe",
      stars: 5,
      body: "They showed up when they said, left the yard clean, and put the bid in writing. That is all I needed.",
      bodyEs: "Llegaron cuando dijeron, dejaron el patio limpio y pusieron el presupuesto por escrito. Eso era todo lo que necesitaba.",
    },
    {
      name: "Elena R.",
      city: "Mesa",
      stars: 5,
      body: "Leak after the first monsoon. They found it, sent photos, and fixed it the same week.",
      bodyEs: "Goteras después del primer monzón. La encontraron, mandaron fotos y la arreglaron la misma semana.",
    },
    {
      name: "James P.",
      city: "Chandler",
      stars: 4,
      body: "Straight talk on price. No fake “we’ve done 10,000 roofs” claims — just the work.",
      bodyEs: "Precio claro. Sin pretender “10,000 techos” — solo el trabajo.",
    },
  ],
  handyman: [
    {
      name: "Teresa V.",
      city: "Avondale",
      stars: 5,
      body: "Patched the drywall, painted the same week, and swept the hall. That is the job.",
      bodyEs: "Taparon la tablaroca, pintaron la misma semana y barrieron el pasillo. Ese es el trabajo.",
    },
    {
      name: "Ben K.",
      city: "Goodyear",
      stars: 5,
      body: "Hung the lights I bought and left a written number. No upsell to a remodel.",
      bodyEs: "Colgaron las luces que yo compré y dejaron un número por escrito. Sin venderme una remodelación.",
    },
    {
      name: "Nia P.",
      city: "Litchfield Park",
      stars: 4,
      body: "Odd jobs done in one Saturday. They answered the phone and showed up when they said.",
      bodyEs: "Trabajos varios en un sábado. Contestaron el teléfono y llegaron cuando dijeron.",
    },
  ],
  carpentry: [
    {
      name: "Maya S.",
      city: "Phoenix",
      stars: 5,
      body: "Walnut cabinets that actually fit the wall. They measured twice, left the shop clean, and put the bid in writing.",
      bodyEs: "Gabinetes de nogal que sí caben en la pared. Midieron dos veces, dejaron el taller limpio y pusieron el presupuesto por escrito.",
    },
    {
      name: "David R.",
      city: "Arcadia",
      stars: 5,
      body: "Built-ins for the living room, scribed to the floor. No catalog boxes. That is the work.",
      bodyEs: "Empotrados para la sala, ajustados al piso. Sin cajas de catálogo. Ese es el trabajo.",
    },
    {
      name: "Elena K.",
      city: "Central Phoenix",
      stars: 4,
      body: "Straight talk on lead time. The table they made is the one we sit at every night.",
      bodyEs: "Tiempos claros. La mesa que hicieron es la que usamos cada noche.",
    },
  ],
  salon: [
    {
      name: "Sofia M.",
      city: "Scottsdale",
      stars: 5,
      body: "Unhurried color and a cut that still looks like me. Booking by phone was easy.",
      bodyEs: "Color sin prisa y un corte que sigue pareciéndose a mí. Agendar por teléfono fue fácil.",
    },
    {
      name: "Priya S.",
      city: "Phoenix",
      stars: 5,
      body: "They told me when they were full instead of squeezing me in. I went back.",
      bodyEs: "Me dijeron cuando estaban llenos en vez de meterse a la fuerza. Volví.",
    },
    {
      name: "Ana L.",
      city: "Tempe",
      stars: 4,
      body: "Calm chairs, honest books, and they remember how I like the blowout.",
      bodyEs: "Sillones tranquilos, agenda honesta y recuerdan cómo me gusta el blowout.",
    },
  ],
  restaurant: [
    {
      name: "Luis G.",
      city: "Mesa",
      stars: 5,
      body: "Short menu, real plates, patio fans that actually help in June.",
      bodyEs: "Menú corto, platos de verdad, ventiladores en el patio que sí ayudan en junio.",
    },
    {
      name: "Hannah K.",
      city: "Gilbert",
      stars: 5,
      body: "We called about a tray for the office. They had it ready and labeled.",
      bodyEs: "Llamamos por una charola para la oficina. La tenían lista y etiquetada.",
    },
    {
      name: "Diego V.",
      city: "Phoenix",
      stars: 4,
      body: "Neighborhood food, not a gimmick. Hours on the site matched the door.",
      bodyEs: "Comida de barrio, no un truco. El horario del sitio coincidía con la puerta.",
    },
  ],
  professional: [
    {
      name: "Rachel T.",
      city: "Phoenix",
      stars: 5,
      body: "Plain answers and a follow-up email I could keep. No jargon fog.",
      bodyEs: "Respuestas claras y un correo de seguimiento que pude guardar. Sin jerga.",
    },
    {
      name: "Omar H.",
      city: "Glendale",
      stars: 5,
      body: "They picked up. That alone put them ahead of the last office I tried.",
      bodyEs: "Contestaron. Eso solo los puso adelante de la última oficina que intenté.",
    },
    {
      name: "Kim B.",
      city: "Peoria",
      stars: 4,
      body: "First meeting was 30 minutes and I left with next steps on paper.",
      bodyEs: "La primera cita fue de 30 minutos y salí con los siguientes pasos en papel.",
    },
  ],
  landscaping: [
    {
      name: "Jordan H.",
      city: "Phoenix",
      stars: 5,
      body: "Desert plants that lived through July. Drip lines actually drip.",
      bodyEs: "Plantas del desierto que sobrevivieron julio. El goteo sí gotea.",
    },
    {
      name: "Maria C.",
      city: "Ahwatukee",
      stars: 5,
      body: "They hauled the debris and swept the walk. Yard looks finished, not abandoned.",
      bodyEs: "Se llevaron los escombros y barrieron. El patio se ve terminado, no abandonado.",
    },
    {
      name: "Chris N.",
      city: "Scottsdale",
      stars: 4,
      body: "No fake “500 projects” banner. Just a crew, a phone number, and a clean rock yard.",
      bodyEs: "Sin un letrero falso de “500 proyectos”. Una cuadrilla, un teléfono y un patio de piedra limpio.",
    },
  ],
  tax: [
    {
      name: "Rosa M.",
      city: "Phoenix",
      stars: 5,
      body: "Brought my W-2 and ID. They told me what was missing and finished the return.",
      bodyEs: "Llevé mi W-2 e identificación. Me dijeron qué faltaba y terminaron la declaración.",
    },
    {
      name: "Andre W.",
      city: "Maryvale",
      stars: 5,
      body: "Small-business return without being pushed into software I do not use.",
      bodyEs: "Declaración de negocio pequeño sin que me empujaran a un programa que no uso.",
    },
    {
      name: "Lucia F.",
      city: "Mesa",
      stars: 4,
      body: "Hours on the door matched the site. I called, they answered, I went in.",
      bodyEs: "El horario de la puerta coincidía con el sitio. Llamé, contestaron, fui.",
    },
  ],
};

export function photoAlt(photo: ShopPhoto, locale: Locale) {
  return locale === "es" ? photo.altEs : photo.alt;
}

/** Walk-in prospect preview that should look finished, including neighbor quotes. */
export const PREMIUM_CARPENTRY_SLUG = "premium-carpentry-designs";

export function shopLayoutReviews(
  client: { slug: string; template: TemplateId; sample?: boolean },
  preview: boolean,
) {
  if (preview || client.sample || client.slug === PREMIUM_CARPENTRY_SLUG) {
    return DEMO_REVIEWS[client.template] ?? [];
  }
  return [];
}

export function serviceName(name: string, locale: Locale) {
  if (locale === "en") return name;
  return SERVICE_BLURBS[name]?.nameEs ?? name;
}

export function serviceBlurb(name: string, locale: Locale) {
  const row = SERVICE_BLURBS[name];
  if (!row) return "";
  return locale === "es" ? row.blurbEs : row.blurb;
}
