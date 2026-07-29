import { apiClient } from "@/lib/api/api-client";
import type { CartItem, CustomerDraft, PublicBusinessData, PublicCatalog } from "../types/public-business.types";
import type { Business } from "@/modules/platform-admin/types/platform-admin.types";

export const publicBusinessService = {
  async load(slug: string): Promise<PublicBusinessData> {
    const [business, catalog] = await Promise.all([
      apiClient<Business>(`/public/businesses/${slug}`),
      apiClient<PublicCatalog>(`/public/businesses/${slug}/catalog`),
    ]);
    return { business, catalog };
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
