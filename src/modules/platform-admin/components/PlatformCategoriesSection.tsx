import type { PlatformAdminData } from "../hooks/usePlatformAdminData";
import { AdminModal } from "./AdminModal";

export function PlatformCategoriesSection({ data }: { data: PlatformAdminData }) {
  const draft = data.platformCategoryDraft;

  return (
    <section className="data-card">
      <div className="card-heading">
        <div><h2>Categorías de plataforma</h2><p>Clasificación global para negocios y productos.</p></div>
        <button className="action-button" onClick={data.newPlatformCategory} type="button">+ Nueva categoría</button>
      </div>
      {data.platformCategories.length ? <div className="table-wrap"><table className="responsive-table compact-mobile-table"><thead><tr><th>Categoría</th><th>Identificador web</th><th>Descripción</th><th>Estado</th><th /></tr></thead><tbody>
        {data.platformCategories.map((category) => <tr key={category.id}><td className="strong-cell mobile-primary-cell" data-label="Categoría"><span className="mobile-category-name">{category.name}</span><span className="desktop-cell-value">{category.name}</span><details className="mobile-row-details"><summary>Ver más</summary><div className="mobile-detail-list"><p><span>Identificador web</span><strong>/{category.slug}</strong></p><p><span>Descripción</span><strong>{category.description ?? "—"}</strong></p><p><span>Estado</span><strong>{category.is_active ? "Activa" : "Inactiva"}</strong></p></div><div className="mobile-detail-actions"><button onClick={() => data.editPlatformCategory(category)} type="button">Editar</button><button className="danger" onClick={() => data.deletePlatformCategory(category)} type="button">Eliminar</button></div></details></td><td data-label="Identificador web">/{category.slug}</td><td className="description-cell" data-label="Descripción">{category.description ?? "—"}</td><td data-label="Estado"><span className={`status-pill ${category.is_active ? "published" : "draft"}`}>{category.is_active ? "Activa" : "Inactiva"}</span></td><td data-label="Acciones"><div className="row-actions"><button onClick={() => data.editPlatformCategory(category)} type="button">Editar</button><button className="danger" onClick={() => data.deletePlatformCategory(category)} type="button">Eliminar</button></div></td></tr>)}
      </tbody></table></div> : <div className="empty-state">No hay categorías globales configuradas.</div>}

      {data.showPlatformCategoryForm ? <AdminModal title={data.editingPlatformCategoryId ? "Editar categoría" : "Nueva categoría"} subtitle="Podrá asignarse opcionalmente a negocios y productos." onClose={() => data.setShowPlatformCategoryForm(false)}><form className="admin-form" onSubmit={data.savePlatformCategory}>
        <div className="form-grid"><label>Nombre<input required maxLength={120} value={draft.name} onChange={(event) => data.setPlatformCategoryDraft({ ...draft, name: event.target.value })} /></label><label>Slug<input required maxLength={100} value={draft.slug} onChange={(event) => data.setPlatformCategoryDraft({ ...draft, slug: event.target.value })} /></label></div>
        <label>Descripción<textarea rows={4} value={draft.description} onChange={(event) => data.setPlatformCategoryDraft({ ...draft, description: event.target.value })} /></label>
        <label className="checkbox-label"><input checked={draft.is_active} onChange={(event) => data.setPlatformCategoryDraft({ ...draft, is_active: event.target.checked })} type="checkbox" /> Categoría activa y disponible para nuevas asociaciones</label>
        <div className="form-footer"><button className="secondary-button" onClick={() => data.setShowPlatformCategoryForm(false)} type="button">Cancelar</button><button className="action-button" disabled={data.isSaving} type="submit">{data.isSaving ? "Guardando…" : "Guardar categoría"}</button></div>
      </form></AdminModal> : null}
    </section>
  );
}
