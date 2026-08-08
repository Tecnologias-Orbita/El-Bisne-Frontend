"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function PublicAccessNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname === "/login" || pathname === "/crear-negocio") return null;
  return <nav aria-label="Acceso" className="public-access-nav"><Link href="/crear-negocio">Crear negocio</Link><Link href="/login">Iniciar sesión</Link></nav>;
}
