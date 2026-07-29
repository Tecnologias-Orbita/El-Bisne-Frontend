import type { AdminSection } from "../types/platform-admin.types";

const navigation: { id: AdminSection; label: string; icon: string }[] = [
  { id: "overview", label: "Resumen", icon: "01" },
  { id: "businesses", label: "Negocios", icon: "02" },
  { id: "categories", label: "Categorías", icon: "03" },
  { id: "payments", label: "Suscripciones", icon: "04" },
  { id: "rates", label: "Tasas de cambio", icon: "05" },
  { id: "settings", label: "Configuración", icon: "06" },
];

type Props = {
  active: AdminSection;
  onNavigate: (section: AdminSection) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
  onToggleDesktop: () => void;
};

export function AdminSidebar({ active, onNavigate, onLogout, isOpen, onClose, onToggleDesktop }: Props) {
  function navigate(section: AdminSection) {
    onNavigate(section);
    onClose();
  }

  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-brand"><span>EB</span><strong>El Bisne</strong><button aria-label="Cerrar menú" className="sidebar-close" onClick={onClose} type="button">×</button></div>
      <button aria-label="Ocultar barra lateral" className="desktop-sidebar-collapse" onClick={onToggleDesktop} type="button"><span>←</span> Ocultar menú</button>
      <nav aria-label="Navegación principal">
        {navigation.map((item) => (
          <button
            className={active === item.id ? "active" : ""}
            key={item.id}
            onClick={() => navigate(item.id)}
            type="button"
          >
            <span className="nav-icon">{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
      <button className="logout-button" onClick={() => { onClose(); onLogout(); }} type="button">Cerrar sesión</button>
    </aside>
  );
}
