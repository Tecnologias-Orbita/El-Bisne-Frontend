import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{ title: string; subtitle: string; onClose: () => void }>;

export function AdminModal({ title, subtitle, onClose, children }: Props) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        aria-modal="true"
        className="admin-modal"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <header className="modal-header">
          <div><h2>{title}</h2><p>{subtitle}</p></div>
          <button aria-label="Volver" className="modal-back-button" onClick={onClose} type="button">← Volver</button>
        </header>
        {children}
      </section>
    </div>
  );
}
