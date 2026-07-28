import type { PlatformAdminData } from "../hooks/usePlatformAdminData";
import { AdminModal } from "./AdminModal";

export function RatesSection({ data }: { data: PlatformAdminData }) {
  const draft = data.rateDraft;
  return (
    <section className="data-card">
      <div className="card-heading"><div><h2>Tasas de cambio</h2><p>Valor de una unidad de cada moneda expresado en CUP.</p></div><button className="action-button" onClick={data.newRate} type="button">+ Nueva tasa</button></div>
      <div className="rate-grid">{data.rates.map((rate) => <article className="rate-card" key={rate.id}><div><span>{rate.currency}</span><small>Moneda</small></div><strong>{Number(rate.value_in_cup).toLocaleString("es-CU", { maximumFractionDigits: 6 })} CUP</strong><div className="row-actions"><button onClick={() => data.editRate(rate)} type="button">Editar</button><button className="danger" onClick={() => data.deleteRate(rate)} type="button">Eliminar</button></div></article>)}</div>
      {!data.rates.length ? <div className="empty-state">No hay tasas configuradas.</div> : null}
      {data.showRateForm ? <AdminModal title={data.editingRateId ? "Editar tasa" : "Nueva tasa"} subtitle="CUP es siempre la moneda de referencia." onClose={() => data.setShowRateForm(false)}><form className="admin-form" onSubmit={data.saveRate}><label>Código de moneda<input required minLength={3} maxLength={3} value={draft.currency} onChange={(e) => data.setRateDraft({ ...draft, currency: e.target.value.toUpperCase() })} /></label><label>Valor en CUP<input required min="0.000001" step="0.000001" type="number" value={draft.value_in_cup} onChange={(e) => data.setRateDraft({ ...draft, value_in_cup: e.target.value })} /></label><div className="form-footer"><button className="secondary-button" onClick={() => data.setShowRateForm(false)} type="button">Cancelar</button><button className="action-button" disabled={data.isSaving} type="submit">Guardar tasa</button></div></form></AdminModal> : null}
    </section>
  );
}
