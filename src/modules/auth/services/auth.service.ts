import { apiClient } from "@/lib/api/api-client";
import type {
  AuthenticatedUser,
  LoginCredentials,
  LoginResponse,
} from "../types/auth.types";
import { sessionService } from "./session.service";

export const authService = {
  login(credentials: LoginCredentials): Promise<LoginResponse> {
    return apiClient<LoginResponse>("/auth/login", {
      method: "POST",
      body: credentials,
    });
  },

  getCurrentUser(accessToken: string): Promise<AuthenticatedUser> {
    return apiClient<AuthenticatedUser>("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  async createSession(
    credentials: LoginCredentials,
  ): Promise<AuthenticatedUser> {
    const tokens = await this.login(credentials);
    const user = await this.getCurrentUser(tokens.access_token);
    sessionService.save(tokens);
    return user;
  },
  listManagedBusinesses(): Promise<{ id: string }[]> {
    const session = sessionService.get();
    if (!session) throw new Error("Tu sesión ha expirado.");
    return apiClient("/businesses", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
  },
};
