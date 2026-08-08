"use client";

import { type FormEvent, useCallback, useEffect, useState } from "react";
import { businessAdminService } from "@/modules/business-admin/services/business-admin.service";
import type { BusinessAdminData, BusinessAdminSection, BusinessDraft, CategoryDraft, MemberDraft, ProductDraft, ServiceDraft } from "@/modules/business-admin/types/business-admin.types";
import { useAuthenticatedUser } from "@/modules/auth/hooks/useAuthenticatedUser";

const emptyCategory: CategoryDraft = { name: "", slug: "", description: "", image_url: "", position: 0, is_visible: true };
const emptyMember: MemberDraft = { full_name: "", email: "", password: "", role: "editor" };
const emptyProduct: ProductDraft = { name: "", slug: "", price: "", currency: "CUP", category_id: "", platform_category_id: "", description: "", image_url: "", is_available: true, is_published: false, track_inventory: false, stock_quantity: "" };
const emptyService: ServiceDraft = { name: "", slug: "", price: "", currency: "CUP", duration_minutes: "", category_id: "", platform_category_id: "", description: "", image_url: "", is_available: true, is_published: false };

export function useBusinessWorkspace(businessId: string) {
  const admin = useAuthenticatedUser();
  const [data, setData] = useState<BusinessAdminData | null>(null);
  const [section, setSection] = useState<BusinessAdminSection>("overview");
  const [businessDraft, setBusinessDraft] = useState<BusinessDraft | null>(null);
  const [categoryDraft, setCategoryDraft] = useState(emptyCategory);
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [productDraft, setProductDraft] = useState(emptyProduct);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [serviceDraft, setServiceDraft] = useState(emptyService);
  const [serviceImage, setServiceImage] = useState<File | null>(null);
  const [memberDraft, setMemberDraft] = useState(emptyMember);
  const [modal, setModal] = useState<"category" | "product" | "service" | "member" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async (preserveDraft = false) => {
    try {
      setError(null);
      const result = await businessAdminService.load(businessId);
      setData(result);
      if (!preserveDraft) setBusinessDraft({ name: result.business.name, description: result.business.description ?? "", sells_online: result.business.sells_online, currency: result.business.currency, timezone: result.business.timezone, contact_email: result.business.contact_email ?? "", contact_phone: result.business.contact_phone ?? "", is_published: result.business.is_published, hero_image_url: result.business.site.hero_image_url ?? "", logo_url: result.business.site.logo_url ?? "", platform_category_id: result.business.platform_category_id ?? "" });
    } catch (caught) { setError(caught instanceof Error ? caught.message : "No pudimos cargar el negocio."); }
  }, [businessId]);

  useEffect(() => {
    if (!admin.user) return;
    const timeoutId = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [admin.user, load]);

  async function mutate(action: () => Promise<unknown>, message: string) {
    setIsSaving(true); setError(null); setNotice(null);
    try { await action(); setNotice(message); setModal(null); await load(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "No pudimos completar la operación."); }
    finally { setIsSaving(false); }
  }
  async function saveBusiness(event: FormEvent) { event.preventDefault(); if (businessDraft) await mutate(() => businessAdminService.updateBusiness(businessId, businessDraft), "Negocio actualizado."); }
  async function saveCategory(event: FormEvent) { event.preventDefault(); await mutate(async () => { const created = editingId ? await businessAdminService.updateCategory(businessId, editingId, categoryDraft) : await businessAdminService.createCategory(businessId, categoryDraft); if (categoryImage) await businessAdminService.uploadImage(businessId, "category", categoryImage, created.id); setCategoryDraft(emptyCategory); setCategoryImage(null); setEditingId(null); }, editingId ? "Categoría actualizada." : "Categoría creada."); }
  async function saveProduct(event: FormEvent) { event.preventDefault(); await mutate(async () => { const created = editingId ? await businessAdminService.updateProduct(businessId, editingId, productDraft) : await businessAdminService.createProduct(businessId, productDraft); if (productImage) await businessAdminService.uploadImage(businessId, "product", productImage, created.id); setProductDraft({ ...emptyProduct, currency: data?.business.currency ?? "CUP" }); setProductImage(null); setEditingId(null); }, editingId ? "Producto actualizado." : "Producto creado."); }
  async function saveService(event: FormEvent) { event.preventDefault(); await mutate(async () => { const created = editingId ? await businessAdminService.updateService(businessId, editingId, serviceDraft) : await businessAdminService.createService(businessId, serviceDraft); if (serviceImage) await businessAdminService.uploadImage(businessId, "service", serviceImage, created.id); setServiceDraft({ ...emptyService, currency: data?.business.currency ?? "CUP" }); setServiceImage(null); setEditingId(null); }, editingId ? "Servicio actualizado." : "Servicio creado."); }
  async function addMember(event: FormEvent) { event.preventDefault(); await mutate(() => businessAdminService.addMember(businessId, memberDraft), "Miembro añadido."); setMemberDraft(emptyMember); }
  const navigate = (next: BusinessAdminSection) => { setSection(next); setMenuOpen(false); };

  const editCategory = (item: BusinessAdminData["categories"][number]) => { setEditingId(item.id); setCategoryDraft({ name: item.name, slug: item.slug, description: item.description ?? "", image_url: item.image_url ?? "", position: item.position, is_visible: item.is_visible }); setCategoryImage(null); setModal("category"); };
  const editProduct = (item: BusinessAdminData["products"][number]) => { setEditingId(item.id); setProductDraft({ name: item.name, slug: item.slug, price: item.price, currency: item.currency, category_id: item.category_id ?? "", platform_category_id: item.platform_category_id ?? "", description: item.description ?? "", image_url: item.image_url ?? "", is_available: item.is_available, is_published: item.is_published, track_inventory: item.track_inventory, stock_quantity: item.stock_quantity?.toString() ?? "" }); setProductImage(null); setModal("product"); };
  const editService = (item: BusinessAdminData["services"][number]) => { setEditingId(item.id); setServiceDraft({ name: item.name, slug: item.slug, price: item.price ?? "", currency: item.currency ?? data?.business.currency ?? "CUP", duration_minutes: item.duration_minutes?.toString() ?? "", category_id: item.category_id ?? "", platform_category_id: item.platform_category_id ?? "", description: item.description ?? "", image_url: item.image_url ?? "", is_available: item.is_available, is_published: item.is_published }); setServiceImage(null); setModal("service"); };
  const openNew = (kind: "category" | "product" | "service" | "member") => { setEditingId(null); if (kind === "category") setCategoryDraft(emptyCategory); if (kind === "product") setProductDraft({ ...emptyProduct, currency: data?.business.currency ?? "CUP" }); if (kind === "service") setServiceDraft({ ...emptyService, currency: data?.business.currency ?? "CUP" }); setModal(kind); };
  return { ...admin, data, section, navigate, businessDraft, setBusinessDraft, categoryDraft, setCategoryDraft, categoryImage, setCategoryImage, productDraft, setProductDraft, productImage, setProductImage, serviceDraft, setServiceDraft, serviceImage, setServiceImage, memberDraft, setMemberDraft, modal, setModal, editingId, openNew, editCategory, editProduct, editService, menuOpen, setMenuOpen, sidebarCollapsed, setSidebarCollapsed, isSaving, error, notice, load, saveBusiness, saveCategory, saveProduct, saveService, addMember, deleteCategory: (id: string) => mutate(() => businessAdminService.deleteCategory(businessId, id), "Categoría eliminada."), deleteProduct: (id: string) => mutate(() => businessAdminService.deleteProduct(businessId, id), "Producto archivado."), deleteService: (id: string) => mutate(() => businessAdminService.deleteService(businessId, id), "Servicio archivado."), removeMember: (id: string) => mutate(() => businessAdminService.removeMember(businessId, id), "Miembro eliminado."), changeMemberRole: (id: string, role: string) => mutate(() => businessAdminService.changeMemberRole(businessId, id, role), "Rol actualizado."), changeOrderStatus: (id: string, status: string) => mutate(() => businessAdminService.changeOrderStatus(businessId, id, status), "Pedido actualizado.") };
}
