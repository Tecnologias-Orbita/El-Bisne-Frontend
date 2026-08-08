import { apiClient } from "@/lib/api/api-client";
import { sessionService } from "@/modules/auth/services/session.service";
import type { Business } from "@/modules/platform-admin/types/platform-admin.types";
import type { BusinessAdminData, BusinessCategory, BusinessDraft, BusinessMember, CategoryDraft, MemberDraft, Order, Product, ProductDraft, Service, ServiceDraft } from "../types/business-admin.types";

function auth(method = "GET", body?: unknown) {
  const session = sessionService.get();
  if (!session) throw new Error("Tu sesión ha expirado.");
  return { method, headers: { Authorization: `Bearer ${session.access_token}` }, body };
}
const nullable = (value: string) => value.trim() || null;

export const businessAdminService = {
  uploadImage(id: string, kind: "logo" | "hero" | "product" | "service" | "category", file: File, resourceId?: string) {
    const form = new FormData(); form.append("file", file);
    const query = resourceId ? `?resource_id=${encodeURIComponent(resourceId)}` : "";
    return apiClient<{ url: string }>(`/businesses/${id}/images/${kind}${query}`, auth("POST", form));
  },
  deleteImage(id: string, kind: "logo" | "hero" | "product" | "service" | "category", resourceId?: string) {
    const query = resourceId ? `?resource_id=${encodeURIComponent(resourceId)}` : "";
    return apiClient<void>(`/businesses/${id}/images/${kind}${query}`, auth("DELETE"));
  },
  async load(businessId: string): Promise<BusinessAdminData> {
    const base = `/businesses/${businessId}`;
    const [business, categories, products, services, members, orders, payments, analytics, platformCategories] = await Promise.all([
      apiClient<Business>(base, auth()), apiClient<BusinessCategory[]>(`${base}/catalog/categories`, auth()), apiClient<Product[]>(`${base}/catalog/products`, auth()), apiClient<Service[]>(`${base}/services`, auth()), apiClient<BusinessMember[]>(`${base}/members`, auth()), apiClient<Order[]>(`${base}/orders`, auth()), apiClient<BusinessAdminData["payments"]>(`${base}/subscription-payments`, auth()), apiClient<BusinessAdminData["analytics"]>(`${base}/analytics`, auth()), apiClient<BusinessAdminData["platformCategories"]>("/platform/categories", auth()),
    ]);
    return { business, categories, products, services, members, orders, payments, analytics, platformCategories };
  },
  updateBusiness(id: string, draft: BusinessDraft) {
    return apiClient<Business>(`/businesses/${id}`, auth("PUT", { ...draft, description: nullable(draft.description), contact_email: nullable(draft.contact_email), contact_phone: nullable(draft.contact_phone), hero_image_url: nullable(draft.hero_image_url), logo_url: nullable(draft.logo_url), platform_category_id: draft.platform_category_id || null }));
  },
  createCategory(id: string, draft: CategoryDraft) { return apiClient<BusinessCategory>(`/businesses/${id}/catalog/categories`, auth("POST", draft)); },
  updateCategory(id: string, categoryId: string, draft: CategoryDraft) { return apiClient<BusinessCategory>(`/businesses/${id}/catalog/categories/${categoryId}`, auth("PUT", { ...draft, description: nullable(draft.description), image_url: nullable(draft.image_url) })); },
  deleteCategory(id: string, categoryId: string) { return apiClient(`/businesses/${id}/catalog/categories/${categoryId}`, auth("DELETE")); },
  createProduct(id: string, draft: ProductDraft) { return apiClient<Product>(`/businesses/${id}/catalog/products`, auth("POST", { ...draft, category_id: draft.category_id || null, platform_category_id: draft.platform_category_id || null, description: nullable(draft.description), image_url: nullable(draft.image_url), stock_quantity: draft.track_inventory && draft.stock_quantity ? Number(draft.stock_quantity) : null })); },
  updateProduct(id: string, productId: string, draft: ProductDraft) { return apiClient<Product>(`/businesses/${id}/catalog/products/${productId}`, auth("PUT", { ...draft, category_id: draft.category_id || null, platform_category_id: draft.platform_category_id || null, description: nullable(draft.description), image_url: nullable(draft.image_url), stock_quantity: draft.track_inventory && draft.stock_quantity ? Number(draft.stock_quantity) : null })); },
  deleteProduct(id: string, productId: string) { return apiClient(`/businesses/${id}/catalog/products/${productId}`, auth("DELETE")); },
  createService(id: string, draft: ServiceDraft) { return apiClient<Service>(`/businesses/${id}/services`, auth("POST", { ...draft, price: draft.price || null, currency: draft.price ? draft.currency : null, duration_minutes: draft.duration_minutes ? Number(draft.duration_minutes) : null, category_id: draft.category_id || null, platform_category_id: draft.platform_category_id || null, description: nullable(draft.description), image_url: nullable(draft.image_url) })); },
  updateService(id: string, serviceId: string, draft: ServiceDraft) { return apiClient<Service>(`/businesses/${id}/services/${serviceId}`, auth("PUT", { ...draft, price: draft.price || null, currency: draft.price ? draft.currency : null, duration_minutes: draft.duration_minutes ? Number(draft.duration_minutes) : null, category_id: draft.category_id || null, platform_category_id: draft.platform_category_id || null, description: nullable(draft.description), image_url: nullable(draft.image_url) })); },
  deleteService(id: string, serviceId: string) { return apiClient(`/businesses/${id}/services/${serviceId}`, auth("DELETE")); },
  addMember(id: string, draft: MemberDraft) { return apiClient(`/businesses/${id}/members`, auth("POST", draft)); },
  changeMemberRole(id: string, userId: string, role: string) { return apiClient(`/businesses/${id}/members/${userId}`, auth("PATCH", { role })); },
  removeMember(id: string, userId: string) { return apiClient(`/businesses/${id}/members/${userId}`, auth("DELETE")); },
  changeOrderStatus(id: string, orderId: string, status: string) { return apiClient(`/businesses/${id}/orders/${orderId}/status`, auth("PATCH", { status })); },
};
