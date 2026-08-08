"use client";

import Image from "next/image";
import { useState } from "react";
import { businessAdminService } from "../services/business-admin.service";
import type { BusinessAdminData } from "../types/business-admin.types";

type Kind = "logo" | "hero" | "product" | "service" | "category";
const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxSize = 500 * 1024;

function ImageField({ businessId, kind, label, url, resourceId, onChanged }: { businessId: string; kind: Kind; label: string; url: string | null; resourceId?: string; onChanged: () => Promise<void> }) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function upload(file?: File) {
    if (!file) return;
    if (!allowedTypes.includes(file.type)) { setError("Usa una imagen JPEG, PNG o WebP."); return; }
    if (file.size > maxSize) { setError("La imagen no puede superar 500 KB."); return; }
    setBusy(true); setError(null);
    try { await businessAdminService.uploadImage(businessId, kind, file, resourceId); await onChanged(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "No pudimos subir la imagen."); }
    finally { setBusy(false); }
  }
  async function remove() {
    setBusy(true); setError(null);
    try { await businessAdminService.deleteImage(businessId, kind, resourceId); await onChanged(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "No pudimos eliminar la imagen."); }
    finally { setBusy(false); }
  }
  return <article className="image-manager-card"><div className="image-manager-preview">{url ? <Image alt={label} fill sizes="180px" src={url} unoptimized /> : <span>Sin imagen</span>}</div><div><strong>{label}</strong><small>JPEG, PNG o WebP · máximo 500 KB</small>{error ? <p className="form-error">{error}</p> : null}<div className="image-manager-actions"><label className="action-button">{busy ? "Procesando…" : url ? "Reemplazar" : "Subir imagen"}<input accept="image/jpeg,image/png,image/webp" disabled={busy} hidden type="file" onChange={(event) => void upload(event.target.files?.[0])} /></label>{url ? <button className="danger-link" disabled={busy} onClick={() => void remove()} type="button">Eliminar</button> : null}</div></div></article>;
}

export function ImageManager({ businessId, data, reload }: { businessId: string; data: BusinessAdminData; reload: () => Promise<void> }) {
  return <section className="data-card"><div className="card-heading"><div><h2>Imágenes</h2><p>Administra los recursos visuales de tu negocio. Todas las imágenes se guardan de forma segura en la plataforma.</p></div></div><div className="image-manager-section"><h3>Identidad del negocio</h3><div className="image-manager-grid"><ImageField businessId={businessId} kind="logo" label="Logo" onChanged={reload} url={data.business.site.logo_url} /><ImageField businessId={businessId} kind="hero" label="Imagen de portada" onChanged={reload} url={data.business.site.hero_image_url} /></div></div>{data.categories.length ? <div className="image-manager-section"><h3>Categorías</h3><div className="image-manager-grid">{data.categories.map((item) => <ImageField businessId={businessId} kind="category" label={item.name} key={item.id} onChanged={reload} resourceId={item.id} url={item.image_url} />)}</div></div> : null}{data.products.length ? <div className="image-manager-section"><h3>Productos</h3><div className="image-manager-grid">{data.products.map((item) => <ImageField businessId={businessId} kind="product" label={item.name} key={item.id} onChanged={reload} resourceId={item.id} url={item.image_url} />)}</div></div> : null}{data.services.length ? <div className="image-manager-section"><h3>Servicios</h3><div className="image-manager-grid">{data.services.map((item) => <ImageField businessId={businessId} kind="service" label={item.name} key={item.id} onChanged={reload} resourceId={item.id} url={item.image_url} />)}</div></div> : null}</section>;
}
