"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authService } from "@/modules/auth/services/auth.service";
import { sessionService } from "@/modules/auth/services/session.service";
import type { AuthenticatedUser } from "@/modules/auth/types/auth.types";

export function usePlatformAdmin() {
  const router = useRouter();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = sessionService.get();
    if (!session) {
      router.replace("/login");
      return;
    }

    let isActive = true;
    void authService
      .getCurrentUser(session.access_token)
      .then((currentUser) => {
        if (!currentUser.is_platform_admin) {
          sessionService.clear();
          router.replace("/login");
          return;
        }
        if (isActive) {
          setUser(currentUser);
          setIsLoading(false);
        }
      })
      .catch(() => {
        sessionService.clear();
        router.replace("/login");
      });

    return () => {
      isActive = false;
    };
  }, [router]);

  function logout() {
    sessionService.clear();
    router.replace("/login");
  }

  return { user, isLoading, logout };
}
