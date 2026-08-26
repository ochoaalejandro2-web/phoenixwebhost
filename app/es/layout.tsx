import type { Metadata } from "next";

export const metadata: Metadata = { title: "Español" };

export default function EsLayout({ children }: { children: React.ReactNode }) {
  return <div lang="es">{children}</div>;
}
