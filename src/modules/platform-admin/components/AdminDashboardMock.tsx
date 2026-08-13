"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePlatformAdmin } from "../hooks/usePlatformAdmin";
import { usePlatformAdminData } from "../hooks/usePlatformAdminData";
import type { AdminSection } from "../types/platform-admin.types";
import { AdminSidebar } from "./AdminSidebar";
import { BusinessesSection } from "./BusinessesSection";
import { OverviewSection } from "./OverviewSection";
import { PaymentsSection } from "./PaymentsSection";
import { PlatformCategoriesSection } from "./PlatformCategoriesSection";
import { RatesSection } from "./RatesSection";
import { SettingsSection } from "./SettingsSection";

const sectionTitles: Record<AdminSection, [string, string]> = {
  overview: ["Resumen", "Una vista clara de la actividad de la plataforma."],
  businesses: ["Negocios", "Consulta y gestiona las cuentas de negocio."],
  categories: ["Categorías", "Define la clasificación reconocida por la plataforma."],
  payments: ["Suscripciones", "Controla los pagos realizados a El Bisne."],
  rates: ["Tasas de cambio", "Mantén las conversiones referenciadas a CUP."],
  settings: ["Configuración", "Actualiza la información operativa de la plataforma."],
};

export function AdminDashboard() {
  const router = useRouter();
  const { user, isLoading, logout } = usePlatformAdmin();
  const data = usePlatformAdminData(Boolean(user));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isSidebarOpen]);

  if (isLoading) {
    return <main className="admin-loading">Preparando tu panel…</main>;
  }

  const [title, subtitle] = sectionTitles[data.activeSection];

  function sectionContent() {
    if (data.activeSection === "businesses") return <BusinessesSection data={data} />;
    if (data.activeSection === "categories") return <PlatformCategoriesSection data={data} />;
    if (data.activeSection === "payments") return <PaymentsSection data={data} />;
    if (data.activeSection === "rates") return <RatesSection data={data} />;
    if (data.activeSection === "settings") return <SettingsSection data={data} />;
    return <OverviewSection data={data} />;
  }

  return (
    <main className={`admin-shell ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <button aria-label="Cerrar menú" className={`sidebar-scrim ${isSidebarOpen ? "visible" : ""}`} onClick={() => setIsSidebarOpen(false)} type="button" />
      <AdminSidebar active={data.activeSection} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={logout} onNavigate={data.setActiveSection} onToggleDesktop={() => setIsSidebarCollapsed(true)} />

      <section className="admin-content">
        <header className="admin-header">
          <button aria-label="Abrir menú" className="menu-button" onClick={() => setIsSidebarOpen(true)} type="button"><span /><span /><span /></button>
          <button aria-label={isSidebarCollapsed ? "Mostrar barra lateral" : "Ocultar barra lateral"} className="desktop-sidebar-trigger" onClick={() => setIsSidebarCollapsed((value) => !value)} type="button"><span /><span /><span /></button>
          <div>
            <p className="eyebrow">Panel global</p>
            <h1>{title}</h1>
            <p className="section-subtitle">{subtitle}</p>
          </div>
          <div className="admin-header-actions"><button className="admin-return-button" onClick={() => router.back()} type="button">← Volver</button><Link className="admin-site-button" href="/">Acceder a El Bisne</Link></div>
          <div className="user-chip"><div><strong>{user?.full_name}</strong><span>{user?.email}</span></div><div className="admin-avatar">{user?.full_name.slice(0, 2).toUpperCase()}</div></div>
        </header>
        {data.error ? <div className="admin-alert error"><span>{data.error}</span><button onClick={data.loadData} type="button">Reintentar</button></div> : null}
        {data.notice ? <div className="admin-alert success">{data.notice}</div> : null}
        {data.isLoading ? <div className="content-loading">Cargando datos reales…</div> : sectionContent()}
      </section>
    </main>
  );
}
