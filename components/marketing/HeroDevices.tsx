export function HeroDevices() {
  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      <div
        className="relative rounded-[1.2rem] border border-gold/40 bg-snow p-2.5 ice-glow"
        style={{
          boxShadow:
            "0 0 0 1px color-mix(in srgb, #5EC8FF 45%, transparent), 0 0 32px color-mix(in srgb, #5EC8FF 28%, transparent), 0 24px 48px color-mix(in srgb, #D4AF37 12%, transparent)",
        }}
      >
        <div className="mb-2 flex items-center gap-1.5 px-1">
          <span className="h-2 w-2 rounded-full bg-gold/70" />
          <span className="h-2 w-2 rounded-full bg-ice/80" />
          <span className="h-2 w-2 rounded-full bg-gold" />
          <span className="ml-2 flex-1 rounded-full border border-gold/25 bg-mist px-3 py-1 text-[10px] tracking-wide text-ink-black/55">
            desertpeak.phoenixwebhost.com
          </span>
        </div>
        <div className="overflow-hidden rounded-lg bg-[#111816] text-[#f4efe6]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <span className="text-sm font-semibold">Desert Peak Roofing</span>
            <span className="text-[11px] text-[#e8b489]">(480) 555-0142</span>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#e8b489]">
                Tempe, AZ
              </p>
              <p className="mt-2 font-display text-2xl leading-tight">
                Roofs that hold up to Arizona sun.
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-white/65">
                Written bids. Clean job sites. A site that answers the phone.
              </p>
              <div className="mt-4 inline-block rounded-full bg-[#c45c26] px-3 py-1.5 text-[11px] font-semibold">
                Call now
              </div>
            </div>
            <div className="hidden grid-cols-2 gap-2 sm:grid">
              {["Replacement", "Leak repair", "Tile", "Inspection"].map((item) => (
                <div
                  key={item}
                  className="rounded-md border border-white/10 px-2 py-3 text-[11px]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute -bottom-10 -left-3 w-[7.5rem] overflow-hidden rounded-[1.4rem] border border-gold/40 bg-snow p-1.5 sm:-left-8 sm:w-36"
        style={{
          boxShadow:
            "0 0 0 1px color-mix(in srgb, #5EC8FF 40%, transparent), 0 0 24px color-mix(in srgb, #5EC8FF 30%, transparent), 0 16px 32px color-mix(in srgb, #0A0A0A 8%, transparent)",
        }}
      >
        <div className="mx-auto mb-1 h-1 w-8 rounded-full bg-ice/70" />
        <div className="overflow-hidden rounded-[1rem] bg-[#f6efe8] text-[#1c1712]">
          <div className="bg-[#3a2a22] px-2 py-3 text-[#f7efe4]">
            <p className="text-[8px] uppercase tracking-[0.16em] text-[#d7b48a]">
              Mesa, AZ
            </p>
            <p className="mt-1 font-display text-[13px] leading-tight">
              Neighborhood plates.
            </p>
          </div>
          <div className="space-y-1.5 p-2">
            <div className="h-1.5 w-3/4 rounded bg-[#e8ddd0]" />
            <div className="h-1.5 w-1/2 rounded bg-[#e8ddd0]" />
            <div className="mt-2 rounded-full bg-[#c45c26] py-1 text-center text-[8px] font-semibold text-white">
              Reserve
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const previews: Record<
  string,
  { bar: string; screen: string; title: string }
> = {
  contractor: {
    bar: "bg-[#111816] text-[#e8b489]",
    screen: "bg-[#1b2420] text-white",
    title: "Trades",
  },
  salon: {
    bar: "bg-[#f6efe8] text-[#8a5a38]",
    screen: "bg-[#fffaf3] text-[#1c1712]",
    title: "Salon",
  },
  restaurant: {
    bar: "bg-[#3a2a22] text-[#d7b48a]",
    screen: "bg-[#f7efe4] text-[#3a2a22]",
    title: "Kitchen",
  },
  professional: {
    bar: "bg-[#eef2ef] text-[#3d4f46]",
    screen: "bg-white text-[#1c1712]",
    title: "Office",
  },
};

export function TemplatePreview({ id }: { id: string }) {
  const look = previews[id] ?? previews.professional;
  return (
    <div className="overflow-hidden rounded-xl border border-gold/30 ice-glow">
      <div className={`flex items-center justify-between px-3 py-2 text-[11px] ${look.bar}`}>
        <span className="font-semibold">{look.title}</span>
        <span className="opacity-70">www</span>
      </div>
      <div className={`h-24 p-3 ${look.screen}`}>
        <div className="h-2 w-2/3 rounded-full bg-current opacity-30" />
        <div className="mt-2 h-1.5 w-full rounded-full bg-current opacity-15" />
        <div className="mt-1.5 h-1.5 w-4/5 rounded-full bg-current opacity-15" />
        <div className="mt-4 h-6 w-20 rounded-full bg-[#d4af37] opacity-90" />
      </div>
    </div>
  );
}
