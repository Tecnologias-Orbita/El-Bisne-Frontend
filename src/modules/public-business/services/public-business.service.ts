import { ApiError, apiClient } from "@/lib/api/api-client";
import type { CartItem, CustomerDraft, PublicBusinessData, PublicCatalog, PublicService } from "../types/public-business.types";
import type { Business } from "@/modules/platform-admin/types/platform-admin.types";

export const publicBusinessService = {
  async load(slug: string): Promise<PublicBusinessData> {
    const business = await apiClient<Business>(`/public/businesses/${slug}`);
    if (!business.is_published) {
      return { business, catalog: { business_id: business.id, business_name: business.name, categories: [], items: [], total: 0 }, services: [] };
    }
    const [catalog, services] = await Promise.all([
      apiClient<PublicCatalog>(`/public/businesses/${slug}/catalog`),
      apiClient<PublicService[]>(`/public/businesses/${slug}/services`).catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 404) return [];
        throw error;
      }),
    ]);
    return { business, catalog, services };
  },
  sendOrder(slug: string, customer: CustomerDraft, items: CartItem[]) {
    return apiClient(`/public/businesses/${slug}/orders`, {
      method: "POST",
      headers: { "Idempotency-Key": crypto.randomUUID() },
      body: {
        customer_name: customer.customer_name.trim(),
        customer_email: customer.customer_email.trim() || null,
        customer_phone: customer.customer_phone.trim() || null,
        notes: customer.notes.trim() || null,
        items: items.map((item) => ({ product_id: item.product.id, quantity: item.quantity })),
      },
    });
  },
};
