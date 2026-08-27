export function Logo({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const onDark = tone === "dark";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark size={32} />
      <span className="leading-tight">
        <span
          className={`block font-display text-[1.05rem] font-semibold tracking-tight ${onDark ? "text-white" : "text-ink-black"}`}
        >
          Phoenixwebhost
        </span>
        <span
          className={`block text-[0.68rem] uppercase tracking-[0.16em] ${onDark ? "text-white/55" : "text-body"}`}
        >
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
      <rect width="32" height="32" rx="8" fill="#FFFFFF" />
      <rect
        x="0.75"
        y="0.75"
        width="30.5"
        height="30.5"
        rx="7.25"
        stroke="#0A0A0A"
        strokeWidth="1.2"
      />
      <path
        d="M6 22 L16 8 L26 22"
        stroke="#00C851"
        strokeWidth="2.4"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M11 22 L16 14 L21 22"
        stroke="#00C851"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
