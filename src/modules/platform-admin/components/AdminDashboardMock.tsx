"use client";

import { usePlatformAdmin } from "../hooks/usePlatformAdmin";
import { usePlatformAdminData } from "../hooks/usePlatformAdminData";
import type { AdminSection } from "../types/platform-admin.types";
import { AdminSidebar } from "./AdminSidebar";
import { BusinessesSection } from "./BusinessesSection";
import { OverviewSection } from "./OverviewSection";
import { PaymentsSection } from "./PaymentsSection";
import { RatesSection } from "./RatesSection";
import { SettingsSection } from "./SettingsSection";

const sectionTitles: Record<AdminSection, [string, string]> = {
  overview: ["Resumen", "Una vista clara de la actividad de la plataforma."],
  businesses: ["Negocios", "Consulta y gestiona las cuentas de negocio."],
  payments: ["Suscripciones", "Controla los pagos realizados a El Bisne."],
  rates: ["Tasas de cambio", "Mantén las conversiones referenciadas a CUP."],
  settings: ["Configuración", "Actualiza la información operativa de la plataforma."],
};

export function AdminDashboard() {
  const { user, isLoading, logout } = usePlatformAdmin();
  const data = usePlatformAdminData(Boolean(user));

  if (isLoading) {
    return <main className="admin-loading">Preparando tu panel…</main>;
  }

  const [title, subtitle] = sectionTitles[data.activeSection];

  function sectionContent() {
    if (data.activeSection === "businesses") return <BusinessesSection data={data} />;
    if (data.activeSection === "payments") return <PaymentsSection data={data} />;
    if (data.activeSection === "rates") return <RatesSection data={data} />;
    if (data.activeSection === "settings") return <SettingsSection data={data} />;
    return <OverviewSection data={data} />;
  }

  return (
    <main className="admin-shell">
      <AdminSidebar active={data.activeSection} onLogout={logout} onNavigate={data.setActiveSection} />

      <section className="admin-content">
        <header className="admin-header">
          <div>
            <p className="eyebrow">Panel global</p>
            <h1>{title}</h1>
            <p className="section-subtitle">{subtitle}</p>
          </div>
          <div className="user-chip"><div><strong>{user?.full_name}</strong><span>{user?.email}</span></div><div className="admin-avatar">{user?.full_name.slice(0, 2).toUpperCase()}</div></div>
        </header>
        <select className="mobile-admin-nav" value={data.activeSection} onChange={(event) => data.setActiveSection(event.target.value as AdminSection)}><option value="overview">Resumen</option><option value="businesses">Negocios</option><option value="payments">Suscripciones</option><option value="rates">Tasas de cambio</option><option value="settings">Configuración</option></select>
        {data.error ? <div className="admin-alert error"><span>{data.error}</span><button onClick={data.loadData} type="button">Reintentar</button></div> : null}
        {data.notice ? <div className="admin-alert success">{data.notice}</div> : null}
        {data.isLoading ? <div className="content-loading">Cargando datos reales…</div> : sectionContent()}
      </section>
    </main>
  );
}
