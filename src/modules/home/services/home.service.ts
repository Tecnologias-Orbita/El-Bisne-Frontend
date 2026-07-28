import { apiClient } from "@/lib/api/api-client";
import type { BackendHealth } from "../types/home.types";

export const homeService = {
  getBackendHealth(): Promise<BackendHealth> {
    return apiClient<BackendHealth>("/health");
  },
};
