"use client";

import { useEffect, useMemo, useState } from "react";
import { platformPublicService } from "../services/platform-public.service";
import type { DiscoveryTab, PlatformDiscovery } from "../types/platform-public.types";

export function usePlatformDiscovery() {
  const [data, setData] = useState<PlatformDiscovery | null>(null);
  const [tab, setTab] = useState<DiscoveryTab>("businesses");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsLoading(true);
      setError(null);
      void platformPublicService.discover(search, categoryId)
        .then(setData)
        .catch((caught) => setError(caught instanceof Error ? caught.message : "No pudimos cargar El Bisne."))
        .finally(() => setIsLoading(false));
    }, search ? 300 : 0);
    return () => window.clearTimeout(timeoutId);
  }, [search, categoryId]);

  const sections = useMemo(() => {
    if (!data) return [];
    const items = tab === "businesses" ? data.businesses : data.products;
    return data.categories.map((category) => ({ category, items: items.filter((item) => item.platform_category_id === category.id) })).filter((section) => section.items.length);
  }, [data, tab]);

  return { data, tab, setTab, search, setSearch, categoryId, setCategoryId, isLoading, error, sections };
}
