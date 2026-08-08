"use client";

import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ApiError } from "@/lib/api/api-client";
import { platformAdminService } from "../services/platform-admin.service";
import type {
  AdminSection,
  Business,
  BusinessDraft,
  ExchangeRate,
  PaymentDraft,
  PaymentFilters,
  PaymentSettings,
  PlatformCategory,
  PlatformCategoryDraft,
  RateDraft,
  SubscriptionPayment,
} from "../types/platform-admin.types";

function isoDate(offsetDays = 0) {
  const value = new Date();
  value.setDate(value.getDate() + offsetDays);
  return value.toISOString().slice(0, 10);
}

const emptyBusiness: BusinessDraft = {
  owner_full_name: "",
  owner_email: "",
  owner_password: "",
  name: "",
  slug: "",
  sells_online: false,
  description: "",
  currency: "CUP",
  timezone: "America/Havana",
  contact_email: "",
  contact_phone: "",
  hero_image_url: "",
  logo_url: "",
  is_published: false,
  transaction_number: "",
  plan: "basic",
  phone_number: "",
  execution_date: isoDate(),
  expiration_date: isoDate(30),
  amount_paid: "",
  platform_category_id: "",
};
const emptyPayment: PaymentDraft = {
  business_id: "",
  transaction_number: "",
  plan: "basic",
  phone_number: "",
  execution_date: isoDate(),
  expiration_date: isoDate(30),
  amount_paid: "",
};
const emptyPaymentFilters: PaymentFilters = {
  payment_id: "",
  business_id: "",
  business_name: "",
  transaction_number: "",
  plan: "",
  phone_number: "",
  execution_date: "",
  expiration_date: "",
  amount_paid: "",
  created_at: "",
};
const emptyRate: RateDraft = { currency: "", value_in_cup: "" };
const emptyPlatformCategory: PlatformCategoryDraft = {
  name: "",
  slug: "",
  description: "",
  is_active: true,
};

export function usePlatformAdminData(enabled: boolean) {
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [payments, setPayments] = useState<SubscriptionPayment[]>([]);
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [platformCategories, setPlatformCategories] = useState<PlatformCategory[]>([]);
  const [settings, setSettings] = useState<PaymentSettings>({
    bank_card: "",
    confirmation_phone_number: "",
  });
  const [businessDraft, setBusinessDraft] = useState<BusinessDraft>(emptyBusiness);
  const [paymentDraft, setPaymentDraft] = useState<PaymentDraft>(emptyPayment);
  const [paymentFilters, setPaymentFilters] = useState<PaymentFilters>(emptyPaymentFilters);
  const [paymentFilterDraft, setPaymentFilterDraft] = useState<PaymentFilters>(emptyPaymentFilters);
  const [businessSearch, setBusinessSearch] = useState("");
  const [businessSearchDraft, setBusinessSearchDraft] = useState("");
  const [rateDraft, setRateDraft] = useState<RateDraft>(emptyRate);
  const [platformCategoryDraft, setPlatformCategoryDraft] = useState<PlatformCategoryDraft>(emptyPlatformCategory);
  const [editingBusinessId, setEditingBusinessId] = useState<string | null>(null);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [editingRateId, setEditingRateId] = useState<string | null>(null);
  const [editingPlatformCategoryId, setEditingPlatformCategoryId] = useState<string | null>(null);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showRateForm, setShowRateForm] = useState(false);
  const [showPlatformCategoryForm, setShowPlatformCategoryForm] = useState(false);
  const [showPaymentFilters, setShowPaymentFilters] = useState(false);
  const [showBusinessSearch, setShowBusinessSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [businessList, paymentList, rateList, categoryList, paymentSettings] = await Promise.all([
        platformAdminService.listBusinesses(),
        platformAdminService.listPayments(),
        platformAdminService.listRates(),
        platformAdminService.listPlatformCategories().catch((categoryError: unknown) => {
          if (categoryError instanceof ApiError && categoryError.status === 404) return [];
          throw categoryError;
        }),
        platformAdminService.getPaymentSettings().catch((settingsError: unknown) => {
          if (settingsError instanceof ApiError && settingsError.status === 404) {
            return { bank_card: "", confirmation_phone_number: "" };
          }
          throw settingsError;
        }),
      ]);
      setBusinesses(businessList);
      setPayments(paymentList);
      setRates(rateList);
      setPlatformCategories(categoryList);
      setSettings(paymentSettings);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "No pudimos cargar los datos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const timeoutId = window.setTimeout(() => void loadData(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [enabled, loadData]);

  async function mutate(action: () => Promise<unknown>, message: string) {
    setIsSaving(true);
    setError(null);
    setNotice(null);
    try {
      await action();
      setNotice(message);
      await loadData();
      return true;
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "La operación no pudo completarse.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  function newBusiness() {
    setEditingBusinessId(null);
    setBusinessDraft(emptyBusiness);
    setShowBusinessForm(true);
  }

  function editBusiness(business: Business) {
    setEditingBusinessId(business.id);
    setBusinessDraft({
      owner_full_name: "",
      owner_email: "",
      owner_password: "",
      name: business.name,
      slug: business.slug,
      sells_online: business.sells_online,
      description: business.description ?? "",
      currency: business.currency,
      timezone: business.timezone,
      contact_email: business.contact_email ?? "",
      contact_phone: business.contact_phone ?? "",
      hero_image_url: business.site.hero_image_url ?? "",
      logo_url: business.site.logo_url ?? "",
      is_published: business.is_published,
      transaction_number: "",
      plan: "basic",
      phone_number: "",
      execution_date: isoDate(),
      expiration_date: isoDate(30),
      amount_paid: "",
      platform_category_id: business.platform_category_id ?? "",
    });
    setShowBusinessForm(true);
  }

  async function saveBusiness(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const success = await mutate(
      () =>
        editingBusinessId
          ? platformAdminService.updateBusiness(editingBusinessId, businessDraft)
          : platformAdminService.createBusiness(businessDraft),
      editingBusinessId ? "Negocio actualizado." : "Negocio creado.",
    );
    if (success) setShowBusinessForm(false);
  }

  async function archiveBusiness(business: Business) {
    if (!window.confirm(`¿Archivar “${business.name}”?`)) return;
    await mutate(() => platformAdminService.archiveBusiness(business.id), "Negocio archivado.");
  }

  function newPayment() {
    setEditingPaymentId(null);
    setPaymentDraft({ ...emptyPayment, business_id: businesses[0]?.id ?? "" });
    setShowPaymentForm(true);
  }

  function editPayment(payment: SubscriptionPayment) {
    setEditingPaymentId(payment.id);
    setPaymentDraft({
      business_id: payment.business_id,
      transaction_number: payment.transaction_number,
      plan: payment.plan,
      phone_number: payment.phone_number,
      execution_date: payment.execution_date,
      expiration_date: payment.expiration_date,
      amount_paid: payment.amount_paid,
    });
    setShowPaymentForm(true);
  }

  async function savePayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const success = await mutate(
      () =>
        editingPaymentId
          ? platformAdminService.updatePayment(editingPaymentId, paymentDraft)
          : platformAdminService.createPayment(paymentDraft),
      editingPaymentId ? "Pago actualizado." : "Pago registrado.",
    );
    if (success) setShowPaymentForm(false);
  }

  async function deletePayment(payment: SubscriptionPayment) {
    if (!window.confirm(`¿Eliminar la transacción ${payment.transaction_number}?`)) return;
    await mutate(() => platformAdminService.deletePayment(payment.id), "Pago eliminado.");
  }

  async function searchPayments(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      setPayments(await platformAdminService.listPayments(paymentFilterDraft));
      setPaymentFilters(paymentFilterDraft);
      setShowPaymentFilters(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "No pudimos buscar los pagos.");
    } finally {
      setIsLoading(false);
    }
  }

  async function clearPaymentFilters() {
    setPaymentFilters(emptyPaymentFilters);
    setPaymentFilterDraft(emptyPaymentFilters);
    setIsLoading(true);
    setError(null);
    try {
      setPayments(await platformAdminService.listPayments());
      setShowPaymentFilters(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "No pudimos cargar los pagos.");
    } finally {
      setIsLoading(false);
    }
  }

  function openPaymentFilters() {
    setPaymentFilterDraft(paymentFilters);
    setShowPaymentFilters(true);
  }

  function newRate() {
    setEditingRateId(null);
    setRateDraft(emptyRate);
    setShowRateForm(true);
  }

  function editRate(rate: ExchangeRate) {
    setEditingRateId(rate.id);
    setRateDraft({ currency: rate.currency, value_in_cup: rate.value_in_cup });
    setShowRateForm(true);
  }

  async function saveRate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const success = await mutate(
      () =>
        editingRateId
          ? platformAdminService.updateRate(editingRateId, rateDraft)
          : platformAdminService.createRate(rateDraft),
      editingRateId ? "Tasa actualizada." : "Tasa creada.",
    );
    if (success) setShowRateForm(false);
  }

  async function deleteRate(rate: ExchangeRate) {
    if (!window.confirm(`¿Eliminar la tasa de ${rate.currency}?`)) return;
    await mutate(() => platformAdminService.deleteRate(rate.id), "Tasa eliminada.");
  }

  function newPlatformCategory() {
    setEditingPlatformCategoryId(null);
    setPlatformCategoryDraft(emptyPlatformCategory);
    setShowPlatformCategoryForm(true);
  }

  function editPlatformCategory(category: PlatformCategory) {
    setEditingPlatformCategoryId(category.id);
    setPlatformCategoryDraft({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      is_active: category.is_active,
    });
    setShowPlatformCategoryForm(true);
  }

  async function savePlatformCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const success = await mutate(
      () => editingPlatformCategoryId
        ? platformAdminService.updatePlatformCategory(editingPlatformCategoryId, platformCategoryDraft)
        : platformAdminService.createPlatformCategory(platformCategoryDraft),
      editingPlatformCategoryId ? "Categoría actualizada." : "Categoría creada.",
    );
    if (success) setShowPlatformCategoryForm(false);
  }

  async function deletePlatformCategory(category: PlatformCategory) {
    if (!window.confirm(`¿Eliminar “${category.name}”? Los negocios y productos asociados quedarán sin categoría global.`)) return;
    await mutate(
      () => platformAdminService.deletePlatformCategory(category.id),
      "Categoría eliminada y asociaciones desacopladas.",
    );
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await mutate(
      () => platformAdminService.updatePaymentSettings(settings),
      "Configuración de cobro actualizada.",
    );
  }

  const metrics = useMemo(
    () => ({
      businesses: businesses.length,
      premium: payments.filter((payment) => payment.plan === "premium").length,
      payments: payments.length,
      published: businesses.filter((business) => business.is_published).length,
    }),
    [businesses, payments],
  );
  const filteredBusinesses = useMemo(() => {
    const query = businessSearch.trim().toLocaleLowerCase("es");
    if (!query) return businesses;
    return businesses.filter((business) =>
      [business.name, business.slug, business.contact_email, business.contact_phone]
        .filter(Boolean)
        .some((value) => value?.toLocaleLowerCase("es").includes(query)),
    );
  }, [businessSearch, businesses]);
  const activePaymentFilterCount = useMemo(
    () => Object.values(paymentFilters).filter((value) => value.trim()).length,
    [paymentFilters],
  );

  function applyBusinessSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusinessSearch(businessSearchDraft);
    setShowBusinessSearch(false);
  }

  function openBusinessSearch() {
    setBusinessSearchDraft(businessSearch);
    setShowBusinessSearch(true);
  }

  function clearBusinessSearch() {
    setBusinessSearch("");
    setBusinessSearchDraft("");
    setShowBusinessSearch(false);
  }

  return {
    activeSection,
    setActiveSection,
    businesses,
    filteredBusinesses,
    businessSearch,
    businessSearchDraft,
    setBusinessSearchDraft,
    payments,
    rates,
    platformCategories,
    settings,
    setSettings,
    businessDraft,
    setBusinessDraft,
    paymentDraft,
    setPaymentDraft,
    paymentFilters,
    paymentFilterDraft,
    setPaymentFilterDraft,
    rateDraft,
    setRateDraft,
    platformCategoryDraft,
    setPlatformCategoryDraft,
    editingBusinessId,
    editingPaymentId,
    editingRateId,
    editingPlatformCategoryId,
    showBusinessForm,
    showPaymentForm,
    showRateForm,
    showPlatformCategoryForm,
    showPaymentFilters,
    showBusinessSearch,
    setShowBusinessForm,
    setShowPaymentForm,
    setShowRateForm,
    setShowPlatformCategoryForm,
    setShowPaymentFilters,
    setShowBusinessSearch,
    isLoading,
    isSaving,
    error,
    notice,
    metrics,
    activePaymentFilterCount,
    loadData,
    newBusiness,
    editBusiness,
    applyBusinessSearch,
    openBusinessSearch,
    clearBusinessSearch,
    saveBusiness,
    archiveBusiness,
    newPayment,
    editPayment,
    savePayment,
    deletePayment,
    searchPayments,
    openPaymentFilters,
    clearPaymentFilters,
    newRate,
    editRate,
    saveRate,
    deleteRate,
    newPlatformCategory,
    editPlatformCategory,
    savePlatformCategory,
    deletePlatformCategory,
    saveSettings,
  };
}

export type PlatformAdminData = ReturnType<typeof usePlatformAdminData>;
