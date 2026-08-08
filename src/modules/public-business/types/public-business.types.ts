import type { Business } from "@/modules/platform-admin/types/platform-admin.types";

export type PublicCategory = { id: string; name: string; slug: string };
export type PublicProduct = { id: string; category_id: string | null; name: string; slug: string; description: string | null; price: string; currency: string; image_url: string | null; is_available: boolean };
export type PublicService = { id: string; category_id: string | null; platform_category_id: string | null; name: string; slug: string; description: string | null; price: string | null; currency: string | null; duration_minutes: number | null; image_url: string | null; is_available: boolean };
export type PublicCatalog = { business_id: string; business_name: string; categories: PublicCategory[]; items: PublicProduct[]; total: number };
export type CartItem = { product: PublicProduct; quantity: number };
export type CustomerDraft = { customer_name: string; customer_email: string; customer_phone: string; notes: string };
export type PublicBusinessData = { business: Business; catalog: PublicCatalog; services: PublicService[] };
