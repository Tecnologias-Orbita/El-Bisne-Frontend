import type { PlatformAdminData } from "../hooks/usePlatformAdminData";

export function OverviewSection({ data }: { data: PlatformAdminData }) {
  const latestPayments = data.payments.slice(0, 5);
  return (
    <div className="section-stack">
      <div className="metric-grid">
        {[
          ["Negocios registrados", data.metrics.businesses, `${data.metrics.published} publicados`],
          ["Planes premium", data.metrics.premium, "Pagos históricos"],
          ["Pagos recibidos", data.metrics.payments, "Suscripciones registradas"],
        ].map(([label, value, detail]) => (
          <article className="metric-card" key={label}>
            <p>{label}</p><strong>{value}</strong><span>{detail}</span>
          </article>
        ))}
      </div>
      <section className="data-card">
        <div className="card-heading"><div><h2>Actividad reciente</h2><p>Últimos pagos registrados.</p></div></div>
        {latestPayments.length ? (
          <div className="table-wrap"><table className="responsive-table compact-mobile-table"><thead><tr><th>Transacción</th><th>Negocio</th><th>Plan</th><th>Fecha</th></tr></thead><tbody>
            {latestPayments.map((payment) => (
              <tr key={payment.id}><td className="strong-cell mobile-primary-cell" data-label="Transacción"><span className="desktop-cell-value">{payment.transaction_number}</span><div className="mobile-payment-summary"><strong>{payment.transaction_number}</strong><span>{data.businesses.find((item) => item.id === payment.business_id)?.name ?? "Negocio archivado"}</span><small>{new Intl.DateTimeFormat("es-CU", { dateStyle: "medium" }).format(new Date(payment.created_at))}</small></div><details className="mobile-row-details"><summary>Ver más</summary><div className="mobile-detail-list"><p><span>Plan</span><strong>{payment.plan}</strong></p><p><span>Fecha de registro</span><strong>{new Intl.DateTimeFormat("es-CU", { dateStyle: "medium" }).format(new Date(payment.created_at))}</strong></p></div></details></td><td data-label="Negocio">{data.businesses.find((item) => item.id === payment.business_id)?.name ?? "Negocio archivado"}</td><td data-label="Plan"><span className={`plan-pill ${payment.plan}`}>{payment.plan}</span></td><td data-label="Fecha">{new Intl.DateTimeFormat("es-CU", { dateStyle: "medium" }).format(new Date(payment.created_at))}</td></tr>
            ))}
          </tbody></table></div>
        ) : <div className="empty-state">Todavía no hay pagos registrados.</div>}
      </section>
    </div>
  );
}
