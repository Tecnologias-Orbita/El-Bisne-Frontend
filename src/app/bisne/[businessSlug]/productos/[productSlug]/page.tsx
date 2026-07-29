import { ProductDetailPage } from "@/modules/public-business/pages/ProductDetailPage";

export default async function Page({ params }: { params: Promise<{ businessSlug: string; productSlug: string }> }) {
  const { businessSlug, productSlug } = await params;
  return <ProductDetailPage businessSlug={businessSlug} productSlug={productSlug} />;
}
