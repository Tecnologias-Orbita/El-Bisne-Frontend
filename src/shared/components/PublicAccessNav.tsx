"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { authService } from "@/modules/auth/services/auth.service";
import { sessionService } from "@/modules/auth/services/session.service";

export function PublicAccessNav() {
  const pathname = usePathname();
  const [access, setAccess] = useState<{ label: string; href: string } | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  useEffect(() => {
    const session = sessionService.get();
    if (!session) {
      const timeoutId = window.setTimeout(() => setCheckingSession(false), 0);
      return () => window.clearTimeout(timeoutId);
    }
    void authService.getCurrentUser(session.access_token).then(async (user) => {
      if (user.is_platform_admin) { setAccess({ label: "Administración", href: "/admin" }); return; }
      const businesses = await authService.listManagedBusinesses();
      if (businesses[0]) setAccess({ label: "Ir a mi negocio", href: `/admin/businesses/${businesses[0].id}` });
    }).catch(() => sessionService.clear()).finally(() => setCheckingSession(false));
  }, []);
  if (pathname.startsWith("/admin") || pathname === "/login" || pathname === "/crear-negocio") return null;
  return <nav aria-label="Acceso" className="public-access-nav"><Link href="/crear-negocio">Crear negocio</Link>{access ? <Link href={access.href}>{access.label}</Link> : checkingSession ? null : <Link href="/login">Iniciar sesión</Link>}</nav>;
}
