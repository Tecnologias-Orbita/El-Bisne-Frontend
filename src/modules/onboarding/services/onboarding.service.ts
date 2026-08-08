import { apiClient } from "@/lib/api/api-client";
import { platformPublicService } from "@/modules/platform-public/services/platform-public.service";
import type { OnboardingData, OnboardingDraft, OnboardingResult, PaymentSettings } from "../types/onboarding.types";

const prices = { basic: "1500.00", premium: "2500.00" } as const;
const isoDate = (date: Date) => date.toISOString().slice(0, 10);

export const onboardingService = {
  async load(): Promise<OnboardingData> {
    const [payment, discovery] = await Promise.all([
      apiClient<PaymentSettings>("/platform/payment-settings"),
      platformPublicService.discover(),
    ]);
    return { payment, categories: discovery.categories.filter((item) => item.is_active) };
  },
  price(plan: OnboardingDraft["plan"]) { return prices[plan]; },
  register(draft: OnboardingDraft): Promise<OnboardingResult> {
    const execution = new Date();
    const expiration = new Date(execution);
    expiration.setDate(expiration.getDate() + 30);
    return apiClient("/auth/register-business", { method: "POST", body: {
      email: draft.email.trim(), password: draft.password, full_name: draft.full_name.trim(),
      business_name: draft.business_name.trim(), slug: draft.slug.trim(), description: draft.description.trim() || null,
      sells_online: draft.sells_online, currency: "CUP", timezone: "America/Havana",
      contact_email: draft.contact_email.trim() || null, contact_phone: draft.contact_phone.trim() || null,
      hero_image_url: null, logo_url: null, platform_category_id: draft.platform_category_id || null,
      transaction_number: draft.transaction_number.trim(), plan: draft.plan,
      phone_number: draft.contact_phone.trim(), execution_date: isoDate(execution), expiration_date: isoDate(expiration),
      amount_paid: prices[draft.plan],
    }});
  },
};
