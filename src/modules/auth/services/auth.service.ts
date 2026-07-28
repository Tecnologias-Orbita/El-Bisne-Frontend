import { apiClient } from "@/lib/api/api-client";
import { sessionService } from "./session.service";
import type {
  AuthenticatedUser,
  LoginCredentials,
  TokenPair,
} from "../types/auth.types";

export const authService = {
  login(credentials: LoginCredentials): Promise<TokenPair> {
    return apiClient<TokenPair>("/auth/login", {
      method: "POST",
      body: credentials,
    });
  },

  getCurrentUser(accessToken: string): Promise<AuthenticatedUser> {
    return apiClient<AuthenticatedUser>("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  async createPlatformSession(credentials: LoginCredentials): Promise<AuthenticatedUser> {
    const tokens = await this.login(credentials);
    const user = await this.getCurrentUser(tokens.access_token);
    if (!user.is_platform_admin) {
      throw new Error("Esta cuenta no tiene acceso a la administración de la plataforma.");
    }
    sessionService.save(tokens);
    return user;
  },
};
