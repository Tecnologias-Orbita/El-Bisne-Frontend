import { LoginForm } from "../components/LoginForm";
import { BackButton } from "@/shared/components/BackButton";

export function LoginPage() {
  return (
    <main className="login-shell">
      <section className="brand-panel">
        <div className="brand-mark">EB</div>
        <div className="brand-copy">
          <p className="eyebrow">Administración central</p>
          <h1>El espacio donde cada bisne empieza a crecer.</h1>
          <p>
            Controla la plataforma, acompaña a los negocios y mantén toda la operación
            visible desde un mismo lugar.
          </p>
        </div>
        <div className="brand-footnote">
          <span className="status-dot" /> Plataforma operativa
        </div>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <BackButton />
          <div className="mobile-brand">El Bisne</div>
          <p className="eyebrow">Bienvenido de vuelta</p>
          <h2>Inicia sesión</h2>
          <p className="login-intro">
            Usa tus credenciales de administración global para continuar.
          </p>
          <LoginForm />
          <p className="login-help">¿Problemas para acceder? Contacta al equipo técnico.</p>
        </div>
      </section>
    </main>
  );
}
