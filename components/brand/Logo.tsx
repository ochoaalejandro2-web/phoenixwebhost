export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="7" fill="#3D4F46" />
        <path d="M6 22h20L22 16 16 21 10 15 6 22Z" fill="#C45C26" />
        <circle cx="22" cy="10" r="4" fill="#F3E6D4" />
      </svg>
      <span className="leading-tight">
        <span className="block font-display text-[1.05rem] font-semibold tracking-tight text-ink">
          Phoenixwebhost
        </span>
        <span className="block text-[0.68rem] uppercase tracking-[0.16em] text-ink-soft">
          Inc. · Phoenix, AZ
        </span>
      </span>
    </span>
  );
}

export function Mark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="7" fill="#3D4F46" />
      <path d="M6 22h20L22 16 16 21 10 15 6 22Z" fill="#C45C26" />
      <circle cx="22" cy="10" r="4" fill="#F3E6D4" />
    </svg>
  );
}
