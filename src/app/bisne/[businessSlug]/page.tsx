import { PublicBusinessPage } from "@/modules/public-business/pages/PublicBusinessPage";

export default async function Page({ params }: { params: Promise<{ businessSlug: string }> }) {
  const { businessSlug } = await params;
  return <PublicBusinessPage slug={businessSlug} />;
}
