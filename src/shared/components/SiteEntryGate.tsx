"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { sessionService } from "@/modules/auth/services/session.service";

const ENTRY_SEEN_KEY = "el-bisne:entry-seen";

export function SiteEntryGate() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsOpen(!sessionService.get() && window.sessionStorage.getItem(ENTRY_SEEN_KEY) !== "true");
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  function continueToSite() {
    window.sessionStorage.setItem(ENTRY_SEEN_KEY, "true");
    setIsOpen(false);
  }

  if (!isOpen) return null;

  const query = searchParams.toString();
  const destination = `${pathname}${query ? `?${query}` : ""}`;
  const loginHref = `/login?next=${encodeURIComponent(destination)}`;
  const createBusinessHref = `/crear-negocio?next=${encodeURIComponent(destination)}`;

  return (
    <div aria-labelledby="entry-title" aria-modal="true" className="site-entry-gate" role="dialog">
      <section className="site-entry-card">
        <div className="site-entry-brand">EB</div>
        <p className="eyebrow">Bienvenido a El Bisne</p>
        <h1 id="entry-title">¿Qué quieres hacer hoy?</h1>
        <p>Descubre negocios cubanos, administra el tuyo o empieza a construir su presencia digital.</p>
        <div className="site-entry-actions">
          <Link href={loginHref} onClick={continueToSite}>Iniciar sesión <span>→</span></Link>
          <Link href={createBusinessHref} onClick={continueToSite}>Crear tu negocio <span>→</span></Link>
          <button onClick={continueToSite} type="button">Continuar comprando <span>↓</span></button>
        </div>
      </section>
    </div>
  );
}
