import type { TokenPair } from "../types/auth.types";

const SESSION_KEY = "el-bisne.platform-session";

export const sessionService = {
  save(tokens: TokenPair): void {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(tokens));
  },

  get(): TokenPair | null {
    if (typeof window === "undefined") return null;
    const stored = window.localStorage.getItem(SESSION_KEY);
    if (!stored) return null;

    try {
      return JSON.parse(stored) as TokenPair;
    } catch {
      window.localStorage.removeItem(SESSION_KEY);
      return null;
    }
  },

  clear(): void {
    window.localStorage.removeItem(SESSION_KEY);
  },
};
