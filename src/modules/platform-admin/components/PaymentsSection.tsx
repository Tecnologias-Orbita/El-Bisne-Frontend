import type { PlatformAdminData } from "../hooks/usePlatformAdminData";
import { AdminModal } from "./AdminModal";

export function PaymentsSection({ data }: { data: PlatformAdminData }) {
  const draft = data.paymentDraft;
  const businessName = (id: string) =>
    data.businesses.find((business) => business.id === id)?.name ?? "Negocio archivado";

  return (
    <section className="data-card">
      <div className="card-heading">
        <div><h2>Pagos de suscripción</h2><p>Historial de transferencias realizadas a la plataforma.</p></div>
        <button className="action-button" onClick={data.newPayment} type="button">+ Registrar pago</button>
      </div>
      {data.payments.length ? <div className="table-wrap"><table><thead><tr><th>Transacción</th><th>Negocio</th><th>Plan</th><th>Teléfono</th><th>Fecha</th><th /></tr></thead><tbody>
        {data.payments.map((payment) => <tr key={payment.id}><td className="strong-cell">{payment.transaction_number}</td><td>{businessName(payment.business_id)}</td><td><span className={`plan-pill ${payment.plan}`}>{payment.plan}</span></td><td>{payment.phone_number}</td><td>{new Intl.DateTimeFormat("es-CU").format(new Date(payment.created_at))}</td><td><div className="row-actions"><button onClick={() => data.editPayment(payment)} type="button">Editar</button><button className="danger" onClick={() => data.deletePayment(payment)} type="button">Eliminar</button></div></td></tr>)}
      </tbody></table></div> : <div className="empty-state">No hay pagos registrados.</div>}

      {data.showPaymentForm ? <AdminModal title={data.editingPaymentId ? "Editar pago" : "Registrar pago"} subtitle="La transacción debe ser única en toda la plataforma." onClose={() => data.setShowPaymentForm(false)}><form className="admin-form" onSubmit={data.savePayment}>
        <label>Negocio<select disabled={Boolean(data.editingPaymentId)} required value={draft.business_id} onChange={(e) => data.setPaymentDraft({ ...draft, business_id: e.target.value })}><option value="">Selecciona un negocio</option>{data.businesses.map((business) => <option key={business.id} value={business.id}>{business.name}</option>)}</select></label>
        <label>Número de transacción<input required value={draft.transaction_number} onChange={(e) => data.setPaymentDraft({ ...draft, transaction_number: e.target.value })} /></label>
        <div className="form-grid"><label>Plan<select value={draft.plan} onChange={(e) => data.setPaymentDraft({ ...draft, plan: e.target.value as "basic" | "premium" })}><option value="basic">Básico</option><option value="premium">Premium</option></select></label><label>Teléfono que confirmó<input required value={draft.phone_number} onChange={(e) => data.setPaymentDraft({ ...draft, phone_number: e.target.value })} /></label></div>
        <div className="form-footer"><button className="secondary-button" onClick={() => data.setShowPaymentForm(false)} type="button">Cancelar</button><button className="action-button" disabled={data.isSaving} type="submit">{data.isSaving ? "Guardando…" : "Guardar pago"}</button></div>
      </form></AdminModal> : null}
    </section>
  );
}
