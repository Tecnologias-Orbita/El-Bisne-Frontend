import { apiClient } from "@/lib/api/api-client";
import { sessionService } from "@/modules/auth/services/session.service";
import type {
  Business,
  BusinessDraft,
  ExchangeRate,
  PaymentDraft,
  PaymentSettings,
  RateDraft,
  SubscriptionPayment,
} from "../types/platform-admin.types";

type AuthenticatedOptions = {
  method: string;
  headers: { Authorization: string };
  body?: unknown;
};

function authenticatedOptions(method = "GET", body?: unknown): AuthenticatedOptions {
  const session = sessionService.get();
  if (!session) throw new Error("Tu sesión ha expirado.");
  return {
    method,
    headers: { Authorization: `Bearer ${session.access_token}` },
    body,
  };
}

function nullable(value: string): string | null {
  return value.trim() || null;
}

function businessPayload(draft: BusinessDraft, editing: boolean) {
  const shared = {
    name: draft.name.trim(),
    business_type: draft.business_type.trim(),
    description: nullable(draft.description),
    currency: draft.currency.toUpperCase(),
    timezone: draft.timezone.trim(),
    contact_email: nullable(draft.contact_email),
    contact_phone: nullable(draft.contact_phone),
    hero_image_url: nullable(draft.hero_image_url),
    logo_url: nullable(draft.logo_url),
  };
  return editing
    ? { ...shared, is_published: draft.is_published }
    : { ...shared, slug: draft.slug.trim() };
}

export const platformAdminService = {
  listBusinesses(): Promise<Business[]> {
    return apiClient("/businesses", authenticatedOptions());
  },
  createBusiness(draft: BusinessDraft): Promise<Business> {
    return apiClient<{ business: Business }>("/auth/register-business", {
      method: "POST",
      body: {
        email: draft.owner_email.trim(),
        password: draft.owner_password,
        full_name: draft.owner_full_name.trim(),
        business_name: draft.name.trim(),
        slug: draft.slug.trim(),
        business_type: draft.business_type.trim(),
        description: nullable(draft.description),
        currency: draft.currency.toUpperCase(),
        timezone: draft.timezone.trim(),
        contact_email: nullable(draft.contact_email),
        contact_phone: nullable(draft.contact_phone),
        hero_image_url: nullable(draft.hero_image_url),
        logo_url: nullable(draft.logo_url),
        transaction_number: draft.transaction_number.trim(),
        plan: draft.plan,
        phone_number: draft.phone_number.trim(),
      },
    }).then((result) => result.business);
  },
  updateBusiness(id: string, draft: BusinessDraft): Promise<Business> {
    return apiClient(
      `/businesses/${id}`,
      authenticatedOptions("PUT", businessPayload(draft, true)),
    );
  },
  archiveBusiness(id: string): Promise<void> {
    return apiClient(`/businesses/${id}`, authenticatedOptions("DELETE"));
  },
  listPayments(): Promise<SubscriptionPayment[]> {
    return apiClient("/platform/admin/subscription-payments", authenticatedOptions());
  },
  createPayment(draft: PaymentDraft): Promise<SubscriptionPayment> {
    return apiClient(
      "/platform/admin/subscription-payments",
      authenticatedOptions("POST", draft),
    );
  },
  updatePayment(id: string, draft: PaymentDraft): Promise<SubscriptionPayment> {
    const payload = {
      transaction_number: draft.transaction_number,
      plan: draft.plan,
      phone_number: draft.phone_number,
    };
    return apiClient(
      `/platform/admin/subscription-payments/${id}`,
      authenticatedOptions("PUT", payload),
    );
  },
  deletePayment(id: string): Promise<void> {
    return apiClient(
      `/platform/admin/subscription-payments/${id}`,
      authenticatedOptions("DELETE"),
    );
  },
  listRates(): Promise<ExchangeRate[]> {
    return apiClient("/platform/exchange-rates", authenticatedOptions());
  },
  createRate(draft: RateDraft): Promise<ExchangeRate> {
    return apiClient(
      "/platform/admin/exchange-rates",
      authenticatedOptions("POST", draft),
    );
  },
  updateRate(id: string, draft: RateDraft): Promise<ExchangeRate> {
    return apiClient(
      `/platform/admin/exchange-rates/${id}`,
      authenticatedOptions("PUT", draft),
    );
  },
  deleteRate(id: string): Promise<void> {
    return apiClient(`/platform/admin/exchange-rates/${id}`, authenticatedOptions("DELETE"));
  },
  getPaymentSettings(): Promise<PaymentSettings> {
    return apiClient("/platform/payment-settings");
  },
  updatePaymentSettings(settings: PaymentSettings): Promise<PaymentSettings> {
    return apiClient(
      "/platform/admin/payment-settings",
      authenticatedOptions("PUT", settings),
    );
  },
};
