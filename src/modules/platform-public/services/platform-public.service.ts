import { apiClient } from "@/lib/api/api-client";
import type { PlatformDiscovery } from "../types/platform-public.types";

export const platformPublicService = {
  async discover(search = "", platformCategoryId = ""): Promise<PlatformDiscovery> {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (platformCategoryId) params.set("platform_category_id", platformCategoryId);
    const query = params.size ? `?${params.toString()}` : "";
    const result = await apiClient<PlatformDiscovery>(`/public/businesses/discovery${query}`);
    return {
      categories: result.categories ?? [],
      businesses: result.businesses ?? [],
      products: result.products ?? [],
      services: result.services ?? [],
    };
  },
};
