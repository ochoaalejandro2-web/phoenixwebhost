import Image from "next/image";

const WORDMARK = {
  src: "/brand/wordmark.png",
  width: 1113,
  height: 322,
} as const;

const ICON = {
  src: "/brand/icon.png",
  width: 512,
  height: 512,
} as const;

export function Logo({
  className = "",
  tone = "light",
  compactOnMobile = false,
  priority = false,
}: {
  className?: string;
  tone?: "light" | "dark";
  compactOnMobile?: boolean;
  priority?: boolean;
}) {
  const onDark = tone === "dark";

  if (onDark) {
    const wordmark = (
      <Image
        src={WORDMARK.src}
        alt=""
        width={WORDMARK.width}
        height={WORDMARK.height}
        priority={priority}
        sizes="160px"
        className={
          compactOnMobile
            ? "hidden h-9 w-auto sm:block"
            : "h-9 w-auto"
        }
        style={{ width: "auto", height: 36 }}
      />
    );
    if (!compactOnMobile) {
      return <span className={`inline-flex items-center ${className}`}>{wordmark}</span>;
    }
    return (
      <span className={`inline-flex items-center ${className}`}>
        <Image
          src={ICON.src}
          alt=""
          width={ICON.width}
          height={ICON.height}
          priority={priority}
          sizes="32px"
          className="h-8 w-8 sm:hidden"
          style={{ width: 32, height: 32 }}
        />
        {wordmark}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark size={32} />
      <span className="leading-tight">
        <span className="block font-display text-[1.05rem] font-semibold tracking-tight text-ink-black">
          Phoenixwebhost
        </span>
        <span className="block text-[0.68rem] uppercase tracking-[0.16em] text-body">
          INC. · PHOENIX, AZ
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
      <rect
        x="0.6"
        y="0.6"
        width="30.8"
        height="30.8"
        rx="7.2"
        fill="#FFFFFF"
        stroke="#0A0A0A"
        strokeWidth="1.2"
      />
      <path
        fill="#00C851"
        fillRule="evenodd"
        d="M16 5.89 L25.6 25.28 L23.87 25.28 L20.22 21.01 L18.78 25.28 L16 17.14 L13.22 25.28 L11.78 21.01 L8.13 25.28 L6.4 25.28 Z M16 11.32 L18.5 15.2 L13.5 15.2 Z"
      />
    </svg>
  );
}
