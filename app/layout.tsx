import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Phoenixwebhost Inc. — Arizona small-business websites",
    template: "%s · Phoenixwebhost",
  },
  description:
    "Phoenixwebhost Inc. builds simple websites for Arizona small businesses. $200 to launch, $69/month to keep it live. Call (480) 953-2393. Owner: Alex Ochoa, Phoenix, AZ.",
  metadataBase: new URL("https://phoenixwebhost.com"),
  openGraph: {
    title: "Phoenixwebhost Inc.",
    description: "$200 to launch a small-business website. $69/month to keep it live.",
    url: "https://phoenixwebhost.com",
    siteName: "Phoenixwebhost Inc.",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${sourceSans.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-snow text-ink-black">{children}</body>
    </html>
  );
}
