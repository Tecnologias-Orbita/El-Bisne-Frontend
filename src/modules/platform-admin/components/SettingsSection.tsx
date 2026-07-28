import type { PlatformAdminData } from "../hooks/usePlatformAdminData";

export function SettingsSection({ data }: { data: PlatformAdminData }) {
  return (
    <section className="settings-layout">
      <div className="data-card">
        <div className="card-heading"><div><h2>Información de cobro</h2><p>Datos públicos mostrados antes de crear una cuenta de negocio.</p></div></div>
        <form className="admin-form settings-form" onSubmit={data.saveSettings}>
          <label>Tarjeta bancaria<input minLength={4} required value={data.settings.bank_card} onChange={(e) => data.setSettings({ ...data.settings, bank_card: e.target.value })} /></label>
          <label>Número para confirmar<input minLength={3} required value={data.settings.confirmation_phone_number} onChange={(e) => data.setSettings({ ...data.settings, confirmation_phone_number: e.target.value })} /></label>
          <div className="form-footer"><button className="action-button" disabled={data.isSaving} type="submit">{data.isSaving ? "Guardando…" : "Actualizar información"}</button></div>
        </form>
      </div>
      <aside className="info-panel"><span>Información pública</span><h3>Estos datos se muestran sin autenticación.</h3><p>Verifica cuidadosamente la tarjeta y el teléfono antes de guardar cualquier cambio.</p></aside>
    </section>
  );
}
