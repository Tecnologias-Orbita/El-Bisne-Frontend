import { seo } from "@/lib/seo/seo";
import { BusinessWorkspacePage } from "@/modules/platform-admin/pages/BusinessWorkspacePage";

export const metadata = seo("Mi negocio");

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  return <BusinessWorkspacePage businessId={businessId} />;
}
