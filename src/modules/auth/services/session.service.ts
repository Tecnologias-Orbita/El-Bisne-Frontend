import type { TokenPair } from "../types/auth.types";

const SESSION_KEY = "el-bisne.platform-session";
export const SESSION_CHANGED_EVENT = "el-bisne:session-changed";
export const ENTRY_SEEN_KEY = "el-bisne:entry-seen";

function notifySessionChanged(): void {
  window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
}

export const sessionService = {
  save(tokens: TokenPair): void {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(tokens));
    notifySessionChanged();
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
    window.sessionStorage.removeItem(ENTRY_SEEN_KEY);
    notifySessionChanged();
  },
};
