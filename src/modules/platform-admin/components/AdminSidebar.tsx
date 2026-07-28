import type { AdminSection } from "../types/platform-admin.types";

const navigation: { id: AdminSection; label: string; icon: string }[] = [
  { id: "overview", label: "Resumen", icon: "01" },
  { id: "businesses", label: "Negocios", icon: "02" },
  { id: "payments", label: "Suscripciones", icon: "03" },
  { id: "rates", label: "Tasas de cambio", icon: "04" },
  { id: "settings", label: "Configuración", icon: "05" },
];

type Props = {
  active: AdminSection;
  onNavigate: (section: AdminSection) => void;
  onLogout: () => void;
};

export function AdminSidebar({ active, onNavigate, onLogout }: Props) {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand"><span>EB</span> El Bisne</div>
      <nav aria-label="Navegación principal">
        {navigation.map((item) => (
          <button
            className={active === item.id ? "active" : ""}
            key={item.id}
            onClick={() => onNavigate(item.id)}
            type="button"
          >
            <span className="nav-icon">{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
      <button className="logout-button" onClick={onLogout} type="button">Cerrar sesión</button>
    </aside>
  );
}
