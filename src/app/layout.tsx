import { Suspense } from "react";
import { SiteEntryGate } from "@/shared/components/SiteEntryGate";
import { PublicSiteFooter } from "@/shared/components/PublicSiteFooter";
import { PublicAccessNav } from "@/shared/components/PublicAccessNav";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  weight: "variable",
  subsets: ["latin-ext"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={inter.className}>
      <body>
        {children}
        <PublicAccessNav />
        <PublicSiteFooter />
        <Suspense fallback={null}>
          <SiteEntryGate />
        </Suspense>
      </body>
    </html>
  );
}
