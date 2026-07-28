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
  PaymentSettings,
  RateDraft,
  SubscriptionPayment,
} from "../types/platform-admin.types";

const emptyBusiness: BusinessDraft = {
  owner_full_name: "",
  owner_email: "",
  owner_password: "",
  name: "",
  slug: "",
  business_type: "",
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
};
const emptyPayment: PaymentDraft = {
  business_id: "",
  transaction_number: "",
  plan: "basic",
  phone_number: "",
};
const emptyRate: RateDraft = { currency: "", value_in_cup: "" };

export function usePlatformAdminData(enabled: boolean) {
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [payments, setPayments] = useState<SubscriptionPayment[]>([]);
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [settings, setSettings] = useState<PaymentSettings>({
    bank_card: "",
    confirmation_phone_number: "",
  });
  const [businessDraft, setBusinessDraft] = useState<BusinessDraft>(emptyBusiness);
  const [paymentDraft, setPaymentDraft] = useState<PaymentDraft>(emptyPayment);
  const [rateDraft, setRateDraft] = useState<RateDraft>(emptyRate);
  const [editingBusinessId, setEditingBusinessId] = useState<string | null>(null);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [editingRateId, setEditingRateId] = useState<string | null>(null);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showRateForm, setShowRateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [businessList, paymentList, rateList, paymentSettings] = await Promise.all([
        platformAdminService.listBusinesses(),
        platformAdminService.listPayments(),
        platformAdminService.listRates(),
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
      business_type: business.business_type,
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

  return {
    activeSection,
    setActiveSection,
    businesses,
    payments,
    rates,
    settings,
    setSettings,
    businessDraft,
    setBusinessDraft,
    paymentDraft,
    setPaymentDraft,
    rateDraft,
    setRateDraft,
    editingBusinessId,
    editingPaymentId,
    editingRateId,
    showBusinessForm,
    showPaymentForm,
    showRateForm,
    setShowBusinessForm,
    setShowPaymentForm,
    setShowRateForm,
    isLoading,
    isSaving,
    error,
    notice,
    metrics,
    loadData,
    newBusiness,
    editBusiness,
    saveBusiness,
    archiveBusiness,
    newPayment,
    editPayment,
    savePayment,
    deletePayment,
    newRate,
    editRate,
    saveRate,
    deleteRate,
    saveSettings,
  };
}

export type PlatformAdminData = ReturnType<typeof usePlatformAdminData>;
