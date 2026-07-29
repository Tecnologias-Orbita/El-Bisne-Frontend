"use client";

import { type FormEvent, useCallback, useEffect, useState } from "react";
import { businessAdminService } from "@/modules/business-admin/services/business-admin.service";
import type { BusinessAdminData, BusinessAdminSection, BusinessDraft, CategoryDraft, MemberDraft, ProductDraft } from "@/modules/business-admin/types/business-admin.types";
import { useAuthenticatedUser } from "@/modules/auth/hooks/useAuthenticatedUser";

const emptyCategory: CategoryDraft = { name: "", slug: "" };
const emptyMember: MemberDraft = { email: "", role: "editor" };
const emptyProduct: ProductDraft = { name: "", slug: "", product_type: "product", price: "", currency: "CUP", category_id: "", platform_category_id: "", description: "", image_url: "", is_published: false };

export function useBusinessWorkspace(businessId: string) {
  const admin = useAuthenticatedUser();
  const [data, setData] = useState<BusinessAdminData | null>(null);
  const [section, setSection] = useState<BusinessAdminSection>("overview");
  const [businessDraft, setBusinessDraft] = useState<BusinessDraft | null>(null);
  const [categoryDraft, setCategoryDraft] = useState(emptyCategory);
  const [productDraft, setProductDraft] = useState(emptyProduct);
  const [memberDraft, setMemberDraft] = useState(emptyMember);
  const [modal, setModal] = useState<"category" | "product" | "member" | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const result = await businessAdminService.load(businessId);
      setData(result);
      setBusinessDraft({ name: result.business.name, description: result.business.description ?? "", business_type: result.business.business_type, currency: result.business.currency, timezone: result.business.timezone, contact_email: result.business.contact_email ?? "", contact_phone: result.business.contact_phone ?? "", is_published: result.business.is_published, hero_image_url: result.business.site.hero_image_url ?? "", logo_url: result.business.site.logo_url ?? "", platform_category_id: result.business.platform_category_id ?? "" });
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
  async function createCategory(event: FormEvent) { event.preventDefault(); await mutate(() => businessAdminService.createCategory(businessId, categoryDraft), "Categoría creada."); setCategoryDraft(emptyCategory); }
  async function createProduct(event: FormEvent) { event.preventDefault(); await mutate(() => businessAdminService.createProduct(businessId, productDraft), "Producto creado."); setProductDraft({ ...emptyProduct, currency: data?.business.currency ?? "CUP" }); }
  async function addMember(event: FormEvent) { event.preventDefault(); await mutate(() => businessAdminService.addMember(businessId, memberDraft), "Miembro añadido."); setMemberDraft(emptyMember); }
  const navigate = (next: BusinessAdminSection) => { setSection(next); setMenuOpen(false); };

  return { ...admin, data, section, navigate, businessDraft, setBusinessDraft, categoryDraft, setCategoryDraft, productDraft, setProductDraft, memberDraft, setMemberDraft, modal, setModal, menuOpen, setMenuOpen, sidebarCollapsed, setSidebarCollapsed, isSaving, error, notice, load, saveBusiness, createCategory, createProduct, addMember, deleteCategory: (id: string) => mutate(() => businessAdminService.deleteCategory(businessId, id), "Categoría eliminada."), deleteProduct: (id: string) => mutate(() => businessAdminService.deleteProduct(businessId, id), "Producto archivado."), removeMember: (id: string) => mutate(() => businessAdminService.removeMember(businessId, id), "Miembro eliminado."), changeMemberRole: (id: string, role: string) => mutate(() => businessAdminService.changeMemberRole(businessId, id, role), "Rol actualizado."), changeOrderStatus: (id: string, status: string) => mutate(() => businessAdminService.changeOrderStatus(businessId, id, status), "Pedido actualizado.") };
}
