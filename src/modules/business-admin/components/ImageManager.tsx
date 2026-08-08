"use client";

import Image from "next/image";
import { useState } from "react";
import { businessAdminService } from "../services/business-admin.service";

type Kind = "logo" | "hero" | "product" | "service" | "category";
const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxSize = 500 * 1024;

export function ImageField({ businessId, kind, label, url, resourceId, onChanged }: { businessId: string; kind: Kind; label: string; url: string | null; resourceId?: string; onChanged: () => Promise<void> }) {
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

export function ImagePicker({ file, label = "Imagen", onChange }: { file: File | null; label?: string; onChange: (file: File | null) => void }) {
  const [error, setError] = useState<string | null>(null);
  function select(next?: File) {
    if (!next) return;
    if (!allowedTypes.includes(next.type)) { setError("Usa una imagen JPEG, PNG o WebP."); return; }
    if (next.size > maxSize) { setError("La imagen no puede superar 500 KB."); return; }
    setError(null); onChange(next);
  }
  return <div className="creation-image-field"><div><strong>{label}</strong><small>JPEG, PNG o WebP · máximo 500 KB</small>{file ? <span>{file.name}</span> : null}{error ? <p className="form-error">{error}</p> : null}</div><div className="image-manager-actions"><label className="secondary-button">{file ? "Cambiar imagen" : "Seleccionar imagen"}<input accept="image/jpeg,image/png,image/webp" hidden type="file" onChange={(event) => select(event.target.files?.[0])} /></label>{file ? <button className="danger-link" onClick={() => onChange(null)} type="button">Quitar</button> : null}</div></div>;
}
