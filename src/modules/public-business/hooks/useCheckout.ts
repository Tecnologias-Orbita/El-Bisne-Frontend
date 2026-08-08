"use client";

import { type FormEvent, useState } from "react";
import { publicBusinessService } from "../services/public-business.service";
import type { CartItem, CustomerDraft } from "../types/public-business.types";

type CreatedOrder = {
  order_number: string;
  currency: string;
  total: string;
};

type BusinessContact = {
  name: string;
  phone: string | null;
};

function buildOrderWhatsAppUrl(
  business: BusinessContact,
  order: CreatedOrder,
  customer: CustomerDraft,
  items: CartItem[],
) {
  const phone = business.phone?.replace(/\D/g, "");
  if (!phone) return null;

  const lines = [
    `Hola, acabo de realizar el pedido ${order.order_number} en El Bisne.`,
    "",
    `Negocio: ${business.name}`,
    `Cliente: ${customer.customer_name.trim()}`,
  ];

  if (customer.customer_phone.trim()) lines.push(`Teléfono: ${customer.customer_phone.trim()}`);
  if (customer.customer_email.trim()) lines.push(`Email: ${customer.customer_email.trim()}`);

  lines.push("", "Productos:");
  for (const item of items) {
    const lineTotal = (Number(item.product.price) * item.quantity).toFixed(2);
    lines.push(`• ${item.quantity} × ${item.product.name} — ${lineTotal} ${order.currency}`);
  }
  lines.push("", `Total: ${order.total} ${order.currency}`);
  if (customer.notes.trim()) lines.push("", `Notas: ${customer.notes.trim()}`);

  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function useCheckout(slug: string, business: BusinessContact, cart: CartItem[], clear: () => void) {
  const [customer, setCustomer] = useState<CustomerDraft>({ customer_name: "", customer_email: "", customer_phone: "", notes: "" });
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [whatsAppUrl, setWhatsAppUrl] = useState<string | null>(null);
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(null);
    if (!customer.customer_email.trim() && !customer.customer_phone.trim()) { setError("Indica al menos un email o un teléfono para contactarte."); return; }
    if (!cart.length) { setError("El carrito está vacío."); return; }
    const canOpenWhatsApp = Boolean(business.phone?.replace(/\D/g, ""));
    const whatsAppWindow = canOpenWhatsApp ? window.open("", "_blank") : null;
    if (whatsAppWindow) whatsAppWindow.opener = null;
    setIsSending(true);
    try {
      const order = await publicBusinessService.sendOrder(slug, customer, cart) as CreatedOrder;
      const url = buildOrderWhatsAppUrl(business, order, customer, cart);
      setOrderNumber(order.order_number);
      setWhatsAppUrl(url);
      clear();
      if (url && whatsAppWindow) whatsAppWindow.location.href = url;
      else if (url) window.open(url, "_blank", "noopener,noreferrer");
    }
    catch (caught) {
      whatsAppWindow?.close();
      setError(caught instanceof Error ? caught.message : "No pudimos enviar el pedido.");
    }
    finally { setIsSending(false); }
  }
  return { customer, setCustomer, isSending, error, orderNumber, whatsAppUrl, submit };
}
