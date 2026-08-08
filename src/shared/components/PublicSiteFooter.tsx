"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function PublicSiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname === "/login" || pathname === "/crear-negocio") return null;
  return <footer className="public-site-footer"><div><strong>El Bisne</strong><span>Una vitrina digital para lo que Cuba crea.</span></div><div><p>¿Tienes un negocio?</p><Link href="/crear-negocio">Únete a nosotros</Link></div></footer>;
}
