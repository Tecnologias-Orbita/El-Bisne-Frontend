import type { PlatformCategory } from "@/modules/platform-public/types/platform-public.types";

export type PaymentSettings = { bank_card: string; confirmation_phone_number: string };
export type OnboardingData = { payment: PaymentSettings; categories: PlatformCategory[] };
export type OnboardingDraft = {
  full_name: string; email: string; password: string;
  business_name: string; slug: string; description: string; platform_category_id: string;
  sells_online: boolean; contact_email: string; contact_phone: string;
  plan: "basic" | "premium"; transaction_number: string;
};
export type OnboardingResult = { business: { id: string; slug: string }; tokens: { access_token: string; refresh_token: string; token_type: string } };
