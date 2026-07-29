import { CartPage } from "@/modules/public-business/pages/CartPage";

export default async function Page({ params }: { params: Promise<{ businessSlug: string }> }) {
  const { businessSlug } = await params;
  return <CartPage slug={businessSlug} />;
}
