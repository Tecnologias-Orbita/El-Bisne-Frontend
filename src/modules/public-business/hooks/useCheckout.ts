"use client";

import { type FormEvent, useState } from "react";
import { publicBusinessService } from "../services/public-business.service";
import type { CartItem, CustomerDraft } from "../types/public-business.types";

export function useCheckout(slug: string, cart: CartItem[], clear: () => void) {
  const [customer, setCustomer] = useState<CustomerDraft>({ customer_name: "", customer_email: "", customer_phone: "", notes: "" });
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(null);
    if (!customer.customer_email.trim() && !customer.customer_phone.trim()) { setError("Indica al menos un email o un teléfono para contactarte."); return; }
    if (!cart.length) { setError("El carrito está vacío."); return; }
    setIsSending(true);
    try { const order = await publicBusinessService.sendOrder(slug, customer, cart) as { order_number: string }; setOrderNumber(order.order_number); clear(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "No pudimos enviar el pedido."); }
    finally { setIsSending(false); }
  }
  return { customer, setCustomer, isSending, error, orderNumber, submit };
}
