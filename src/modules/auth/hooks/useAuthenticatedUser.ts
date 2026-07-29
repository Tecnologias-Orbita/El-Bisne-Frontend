"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authService } from "../services/auth.service";
import { sessionService } from "../services/session.service";
import type { AuthenticatedUser } from "../types/auth.types";

export function useAuthenticatedUser() {
  const router = useRouter();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const session = sessionService.get();
    if (!session) { router.replace("/login"); return; }
    void authService.getCurrentUser(session.access_token).then((result) => { setUser(result); setIsLoading(false); }).catch(() => { sessionService.clear(); router.replace("/login"); });
  }, [router]);
  const logout = () => { sessionService.clear(); router.replace("/login"); };
  return { user, isLoading, logout };
}
