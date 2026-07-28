"use client";

import { useCallback, useEffect, useState } from "react";
import { homeService } from "../services/home.service";
import type { BackendStatus } from "../types/home.types";

export function useBackendHealth() {
  const [status, setStatus] = useState<BackendStatus>("loading");

  const checkHealth = useCallback(async () => {
    setStatus("loading");

    try {
      await homeService.getBackendHealth();
      setStatus("online");
    } catch {
      setStatus("offline");
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    void homeService
      .getBackendHealth()
      .then(() => {
        if (isActive) setStatus("online");
      })
      .catch(() => {
        if (isActive) setStatus("offline");
      });

    return () => {
      isActive = false;
    };
  }, []);

  return { status, retry: checkHealth };
}
