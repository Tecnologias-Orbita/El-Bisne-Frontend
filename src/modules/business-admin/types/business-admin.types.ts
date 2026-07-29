import type { Business, PlatformCategory, SubscriptionPayment } from "@/modules/platform-admin/types/platform-admin.types";

export type BusinessAdminSection = "overview" | "business" | "categories" | "products" | "orders" | "team" | "subscription";
export type BusinessCategory = { id: string; name: string; slug: string };
export type Product = { id: string; category_id: string | null; platform_category_id: string | null; name: string; slug: string; product_type: "product" | "service"; description: string | null; price: string; currency: string; image_url: string | null; is_available: boolean };
export type BusinessMember = { id: string; user_id: string; email: string; full_name: string; role: string };
export type Order = { id: string; order_number: string; status: string; currency: string; subtotal: string; total: string };
export type Analytics = { visits: number; product_views: number; orders: number; completed_orders: number; conversion_rate: number };
export type BusinessDraft = { name: string; description: string; business_type: string; currency: string; timezone: string; contact_email: string; contact_phone: string; is_published: boolean; hero_image_url: string; logo_url: string; platform_category_id: string };
export type CategoryDraft = { name: string; slug: string };
export type ProductDraft = { name: string; slug: string; product_type: "product" | "service"; price: string; currency: string; category_id: string; platform_category_id: string; description: string; image_url: string; is_published: boolean };
export type MemberDraft = { email: string; role: "admin" | "editor" | "viewer" };
export type BusinessAdminData = { business: Business; categories: BusinessCategory[]; products: Product[]; members: BusinessMember[]; orders: Order[]; payments: SubscriptionPayment[]; analytics: Analytics; platformCategories: PlatformCategory[] };
