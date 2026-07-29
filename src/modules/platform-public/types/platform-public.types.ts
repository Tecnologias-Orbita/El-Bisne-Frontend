export type PlatformCategory = { id: string; name: string; slug: string; description: string | null; is_active: boolean };
export type DiscoveryBusiness = { id: string; name: string; slug: string; description: string | null; business_type: string; platform_category_id: string | null; hero_image_url: string | null; logo_url: string | null };
export type DiscoveryProduct = { id: string; business_id: string; business_name: string; business_slug: string; platform_category_id: string | null; name: string; slug: string; description: string | null; price: string; currency: string; image_url: string | null; is_available: boolean };
export type PlatformDiscovery = { categories: PlatformCategory[]; businesses: DiscoveryBusiness[]; products: DiscoveryProduct[] };
export type DiscoveryTab = "businesses" | "products";
