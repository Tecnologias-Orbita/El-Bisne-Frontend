import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteEntryGate } from "@/shared/components/SiteEntryGate";
import { PublicSiteFooter } from "@/shared/components/PublicSiteFooter";
import { PublicAccessNav } from "@/shared/components/PublicAccessNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "El Bisne | Administración",
  description: "Administración global de la plataforma El Bisne",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        {children}
        <PublicAccessNav />
        <PublicSiteFooter />
        <Suspense fallback={null}><SiteEntryGate /></Suspense>
      </body>
    </html>
  );
}
