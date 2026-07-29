"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { publicBusinessService } from "../services/public-business.service";
import type { CartItem, PublicBusinessData, PublicProduct } from "../types/public-business.types";

const cartKey = (slug: string) => `el-bisne-cart:${slug}`;

export function usePublicBusiness(slug: string) {
  const [data, setData] = useState<PublicBusinessData | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const saved = window.localStorage.getItem(cartKey(slug));
      if (saved) setCart(JSON.parse(saved) as CartItem[]);
      void publicBusinessService.load(slug).then(setData).catch((caught) => setError(caught instanceof Error ? caught.message : "No pudimos abrir este bisne."));
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [slug]);
  const persist = useCallback((items: CartItem[]) => { setCart(items); window.localStorage.setItem(cartKey(slug), JSON.stringify(items)); }, [slug]);
  const add = (product: PublicProduct) => persist(cart.some((item) => item.product.id === product.id) ? cart.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...cart, { product, quantity: 1 }]);
  const setQuantity = (id: string, quantity: number) => persist(quantity < 1 ? cart.filter((item) => item.product.id !== id) : cart.map((item) => item.product.id === id ? { ...item, quantity } : item));
  const clear = () => persist([]);
  const filtered = useMemo(() => data?.catalog.items.filter((product) => [product.name, product.description].some((value) => value?.toLocaleLowerCase("es").includes(search.trim().toLocaleLowerCase("es")))) ?? [], [data, search]);
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  const quantityFor = (id: string) => cart.find((item) => item.product.id === id)?.quantity ?? 0;
  return { data, cart, search, setSearch, searchOpen, setSearchOpen, descriptionOpen, setDescriptionOpen, error, filtered, count, total, add, setQuantity, quantityFor, clear };
}
