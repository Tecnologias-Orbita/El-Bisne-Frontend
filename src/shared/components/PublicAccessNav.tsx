"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authService } from "@/modules/auth/services/auth.service";
import { SESSION_CHANGED_EVENT, sessionService } from "@/modules/auth/services/session.service";

export function PublicAccessNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [access, setAccess] = useState<{ label: string; href: string } | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  useEffect(() => {
    let isActive = true;
    const updateAccess = async () => {
      setAccess(null);
      const session = sessionService.get();
      if (!session) { if (isActive) setCheckingSession(false); return; }
      if (isActive) setCheckingSession(true);
      try {
        const user = await authService.getCurrentUser(session.access_token);
        if (!isActive) return;
        if (user.is_platform_admin) { setAccess({ label: "Admin", href: "/admin" }); return; }
        const businesses = await authService.listManagedBusinesses();
        if (isActive && businesses[0]) setAccess({ label: "Administrar mi negocio", href: `/admin/businesses/${businesses[0].id}` });
      } catch {
        sessionService.clear();
      } finally {
        if (isActive) setCheckingSession(false);
      }
    };
    void updateAccess();
    window.addEventListener(SESSION_CHANGED_EVENT, updateAccess);
    window.addEventListener("storage", updateAccess);
    return () => {
      isActive = false;
      window.removeEventListener(SESSION_CHANGED_EVENT, updateAccess);
      window.removeEventListener("storage", updateAccess);
    };
  }, []);
  function logout() {
    sessionService.clear();
    setAccess(null);
    router.replace("/");
  }
  // Las páginas de cada negocio ya tienen una barra de navegación propia.
  // Mantener esta navegación global allí creaba dos cabeceras superpuestas.
  if (pathname.startsWith("/admin") || pathname.startsWith("/bisne/") || pathname === "/login" || pathname === "/crear-negocio") return null;
  if (checkingSession) return null;
  return access ? <nav aria-label="Cuenta" className="public-access-nav"><Link href={access.href}>{access.label}</Link><button onClick={logout} type="button">Logout</button></nav> : <nav aria-label="Acceso" className="public-access-nav"><Link href="/crear-negocio">Publicar mi negocio</Link><Link href="/login">Iniciar sesión</Link></nav>;
}
