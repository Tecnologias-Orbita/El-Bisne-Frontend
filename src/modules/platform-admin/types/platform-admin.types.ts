export type AdminSection = "overview" | "businesses" | "categories" | "payments" | "rates" | "settings";

export type Business = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  business_type: string;
  currency: string;
  timezone: string;
  contact_email: string | null;
  contact_phone: string | null;
  is_published: boolean;
  platform_category_id: string | null;
  site: { hero_image_url: string | null; logo_url: string | null };
};

export type SubscriptionPlan = "basic" | "premium";

export type SubscriptionPayment = {
  id: string;
  business_id: string;
  transaction_number: string;
  plan: SubscriptionPlan;
  phone_number: string;
  execution_date: string;
  expiration_date: string;
  amount_paid: string;
  created_at: string;
};

export type ExchangeRate = {
  id: string;
  currency: string;
  value_in_cup: string;
};

export type PlatformCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
};

export type PlatformCategoryDraft = {
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
};

export type PaymentSettings = {
  bank_card: string;
  confirmation_phone_number: string;
};

export type BusinessDraft = {
  owner_full_name: string;
  owner_email: string;
  owner_password: string;
  name: string;
  slug: string;
  business_type: string;
  description: string;
  currency: string;
  timezone: string;
  contact_email: string;
  contact_phone: string;
  hero_image_url: string;
  logo_url: string;
  is_published: boolean;
  transaction_number: string;
  plan: SubscriptionPlan;
  phone_number: string;
  execution_date: string;
  expiration_date: string;
  amount_paid: string;
  platform_category_id: string;
};

export type PaymentDraft = {
  business_id: string;
  transaction_number: string;
  plan: SubscriptionPlan;
  phone_number: string;
  execution_date: string;
  expiration_date: string;
  amount_paid: string;
};

export type PaymentFilters = {
  payment_id: string;
  business_id: string;
  business_name: string;
  transaction_number: string;
  plan: "" | SubscriptionPlan;
  phone_number: string;
  execution_date: string;
  expiration_date: string;
  amount_paid: string;
  created_at: string;
};

export type RateDraft = { currency: string; value_in_cup: string };
