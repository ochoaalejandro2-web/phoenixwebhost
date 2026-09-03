import { SeeYourSitePage } from "@/components/marketing/SeeYourSitePage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "See your site",
  description:
    "Type your business name, pick a type, and see a live-looking Phoenixwebhost preview with clear $200 + $69 pricing.",
};

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; type?: string }>;
}) {
  const { name, type } = await searchParams;
  return <SeeYourSitePage locale="en" name={name} type={type} />;
}
