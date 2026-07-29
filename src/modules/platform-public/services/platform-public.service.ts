import { apiClient } from "@/lib/api/api-client";
import type { PlatformDiscovery } from "../types/platform-public.types";

export const platformPublicService = {
  discover(search = "", platformCategoryId = "") {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (platformCategoryId) params.set("platform_category_id", platformCategoryId);
    const query = params.size ? `?${params.toString()}` : "";
    return apiClient<PlatformDiscovery>(`/public/businesses/discovery${query}`);
  },
};
