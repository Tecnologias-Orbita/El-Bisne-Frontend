import { apiClient } from "@/lib/api/api-client";
import { sessionService } from "@/modules/auth/services/session.service";
import type { Business } from "@/modules/platform-admin/types/platform-admin.types";
import type { BusinessAdminData, BusinessCategory, BusinessDraft, BusinessMember, CategoryDraft, MemberDraft, Order, Product, ProductDraft } from "../types/business-admin.types";

function auth(method = "GET", body?: unknown) {
  const session = sessionService.get();
  if (!session) throw new Error("Tu sesión ha expirado.");
  return { method, headers: { Authorization: `Bearer ${session.access_token}` }, body };
}
const nullable = (value: string) => value.trim() || null;

export const businessAdminService = {
  async load(businessId: string): Promise<BusinessAdminData> {
    const base = `/businesses/${businessId}`;
    const [business, categories, products, members, orders, payments, analytics, platformCategories] = await Promise.all([
      apiClient<Business>(base, auth()), apiClient<BusinessCategory[]>(`${base}/catalog/categories`, auth()), apiClient<Product[]>(`${base}/catalog/products`, auth()), apiClient<BusinessMember[]>(`${base}/members`, auth()), apiClient<Order[]>(`${base}/orders`, auth()), apiClient<BusinessAdminData["payments"]>(`${base}/subscription-payments`, auth()), apiClient<BusinessAdminData["analytics"]>(`${base}/analytics`, auth()), apiClient<BusinessAdminData["platformCategories"]>("/platform/categories", auth()),
    ]);
    return { business, categories, products, members, orders, payments, analytics, platformCategories };
  },
  updateBusiness(id: string, draft: BusinessDraft) {
    return apiClient<Business>(`/businesses/${id}`, auth("PUT", { ...draft, description: nullable(draft.description), contact_email: nullable(draft.contact_email), contact_phone: nullable(draft.contact_phone), hero_image_url: nullable(draft.hero_image_url), logo_url: nullable(draft.logo_url), platform_category_id: draft.platform_category_id || null }));
  },
  createCategory(id: string, draft: CategoryDraft) { return apiClient(`/businesses/${id}/catalog/categories`, auth("POST", draft)); },
  deleteCategory(id: string, categoryId: string) { return apiClient(`/businesses/${id}/catalog/categories/${categoryId}`, auth("DELETE")); },
  createProduct(id: string, draft: ProductDraft) { return apiClient(`/businesses/${id}/catalog/products`, auth("POST", { ...draft, category_id: draft.category_id || null, platform_category_id: draft.platform_category_id || null, description: nullable(draft.description), image_url: nullable(draft.image_url) })); },
  deleteProduct(id: string, productId: string) { return apiClient(`/businesses/${id}/catalog/products/${productId}`, auth("DELETE")); },
  addMember(id: string, draft: MemberDraft) { return apiClient(`/businesses/${id}/members`, auth("POST", draft)); },
  changeMemberRole(id: string, userId: string, role: string) { return apiClient(`/businesses/${id}/members/${userId}`, auth("PATCH", { role })); },
  removeMember(id: string, userId: string) { return apiClient(`/businesses/${id}/members/${userId}`, auth("DELETE")); },
  changeOrderStatus(id: string, orderId: string, status: string) { return apiClient(`/businesses/${id}/orders/${orderId}/status`, auth("PATCH", { status })); },
};
