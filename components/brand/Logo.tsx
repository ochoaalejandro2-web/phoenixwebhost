export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark size={32} />
      <span className="leading-tight">
        <span className="block font-display text-[1.05rem] font-semibold tracking-tight text-ink-black">
          Phoenixwebhost
        </span>
        <span className="block text-[0.68rem] uppercase tracking-[0.16em] text-ink-black/55">
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
      <rect width="32" height="32" rx="7" fill="#FFFFFF" />
      <rect
        x="0.7"
        y="0.7"
        width="30.6"
        height="30.6"
        rx="6.3"
        stroke="#D4AF37"
        strokeWidth="1.4"
      />
      <path
        d="M6 22 L16 8 L26 22"
        stroke="#D4AF37"
        strokeWidth="2.2"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M11 22 L16 14 L21 22"
        stroke="#5EC8FF"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
