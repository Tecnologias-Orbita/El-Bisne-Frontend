import { apiClient } from "@/lib/api/api-client";
import type {
  DiscoveryBusiness,
  DiscoveryProduct,
  DiscoveryService,
  PlatformDiscovery,
} from "../types/platform-public.types";

type LegacyDiscoveryProduct = Omit<DiscoveryProduct, "business_logo_url"> & {
  business_logo_url?: string | null;
};

type LegacyDiscoveryService = Omit<DiscoveryService, "business_logo_url"> & {
  business_logo_url?: string | null;
};

type DiscoveryPayload = Omit<PlatformDiscovery, "products" | "services"> & {
  products?: LegacyDiscoveryProduct[];
  services?: LegacyDiscoveryService[];
};

function enrichBusinessLogos<T extends { business_slug: string; business_logo_url?: string | null }>(
  entries: T[],
  logosByBusinessSlug: ReadonlyMap<string, string | null>,
): Array<Omit<T, "business_logo_url"> & { business_logo_url: string | null }> {
  return entries.map((entry) => ({
    ...entry,
    business_logo_url: entry.business_logo_url ?? logosByBusinessSlug.get(entry.business_slug) ?? null,
  }));
}

export const platformPublicService = {
  async discover(search = "", platformCategoryId = ""): Promise<PlatformDiscovery> {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (platformCategoryId) params.set("platform_category_id", platformCategoryId);
    const query = params.size ? `?${params.toString()}` : "";
    const result = await apiClient<DiscoveryPayload>(`/public/businesses/discovery${query}`);
    const businesses = result.businesses ?? [];
    const logosByBusinessSlug = new Map<string, string | null>(
      businesses.map((business: DiscoveryBusiness) => [business.slug, business.logo_url]),
    );

    return {
      categories: result.categories ?? [],
      businesses,
      products: enrichBusinessLogos(result.products ?? [], logosByBusinessSlug),
      services: enrichBusinessLogos(result.services ?? [], logosByBusinessSlug),
    };
  },
};
