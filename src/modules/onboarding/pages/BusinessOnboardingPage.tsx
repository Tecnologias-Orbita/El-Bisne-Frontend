"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { sessionService } from "@/modules/auth/services/session.service";
import { onboardingService } from "../services/onboarding.service";
import type { OnboardingData, OnboardingDraft } from "../types/onboarding.types";

const initialDraft: OnboardingDraft = { full_name: "", email: "", password: "", business_name: "", slug: "", description: "", platform_category_id: "", sells_online: false, contact_email: "", contact_phone: "", plan: "basic", transaction_number: "" };
type FieldErrors = Partial<Record<keyof OnboardingDraft, string>>;
const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function BusinessOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState(initialDraft);
  const [data, setData] = useState<OnboardingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { void onboardingService.load().then(setData).catch((caught) => setError(caught instanceof Error ? caught.message : "No pudimos cargar el registro.")); }, []);
  const update = <K extends keyof OnboardingDraft>(key: K, value: OnboardingDraft[K]) => { setDraft((current) => ({ ...current, [key]: value })); setFieldErrors((current) => ({ ...current, [key]: undefined })); };
  const goTo = (nextStep: number) => { setError(null); setStep(nextStep); window.scrollTo({ top: 0, behavior: "smooth" }); };

  async function continueOwner(event: FormEvent) {
    event.preventDefault(); setIsSubmitting(true); setError(null);
    try {
      const availability = await onboardingService.availability({ email: draft.email.trim() });
      if (!availability.email_available) { setFieldErrors({ email: "Ya existe una cuenta con este correo. Puedes iniciar sesión o utilizar otro." }); return; }
      goTo(2);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "No pudimos validar el correo."); }
    finally { setIsSubmitting(false); }
  }

  async function continueBusiness(event: FormEvent) {
    event.preventDefault(); setIsSubmitting(true); setError(null);
    try {
      const availability = await onboardingService.availability({ slug: draft.slug.trim() });
      if (!availability.slug_available) { setFieldErrors({ slug: "Este identificador ya está siendo utilizado. Elige otro para tu negocio." }); return; }
      goTo(3);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "No pudimos validar el negocio."); }
    finally { setIsSubmitting(false); }
  }

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(null); setIsSubmitting(true);
    try {
      const availability = await onboardingService.availability({ transaction_number: draft.transaction_number.trim() });
      if (!availability.transaction_available) { setFieldErrors({ transaction_number: "Este número de confirmación ya fue registrado." }); return; }
      const result = await onboardingService.register(draft);
      sessionService.save(result.tokens);
      router.push(`/admin/businesses/${result.business.id}`);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "No pudimos crear el negocio.";
      const normalized = message.toLowerCase();
      if (normalized.includes("email") || normalized.includes("correo")) { setFieldErrors({ email: message }); goTo(1); }
      else if (normalized.includes("slug") || normalized.includes("identificador")) { setFieldErrors({ slug: message }); goTo(2); }
      else if (normalized.includes("transaction") || normalized.includes("transacción")) setFieldErrors({ transaction_number: message });
      else setError(message);
    } finally { setIsSubmitting(false); }
  }

  return <main className="onboarding-page"><header><Link href="/">El Bisne</Link><Link href="/login">Iniciar sesión</Link></header><div className="onboarding-progress"><span>Paso {step} de 3</span><div>{[1,2,3].map((item) => <i className={item <= step ? "active" : ""} key={item} />)}</div></div><section className="onboarding-card">
    {step === 1 ? <><p className="eyebrow">Tu cuenta</p><h1>Empecemos por conocerte.</h1><p>Estos serán los datos del propietario principal del negocio.</p><form onSubmit={continueOwner}><label>Nombre completo<input autoComplete="name" minLength={2} required value={draft.full_name} onChange={(e) => update("full_name", e.target.value)} /></label><label>Correo electrónico<input aria-invalid={Boolean(fieldErrors.email)} autoComplete="email" required type="email" value={draft.email} onChange={(e) => { update("email", e.target.value); if (!draft.contact_email) update("contact_email", e.target.value); }} />{fieldErrors.email ? <small className="field-error">{fieldErrors.email}</small> : null}</label><label>Contraseña<input autoComplete="new-password" minLength={8} required type="password" value={draft.password} onChange={(e) => update("password", e.target.value)} /><small>Debe tener al menos 8 caracteres.</small></label>{error ? <div className="form-error">{error}</div> : null}<button disabled={isSubmitting}>{isSubmitting ? "Validando…" : "Continuar →"}</button></form></> : null}
    {step === 2 ? <><p className="eyebrow">Tu negocio</p><h1>La información esencial.</h1><p>Más adelante podrás personalizar imágenes, catálogo, servicios y apariencia desde tu panel.</p><form onSubmit={continueBusiness}><label>Nombre del negocio<input minLength={2} required value={draft.business_name} onChange={(e) => { update("business_name", e.target.value); update("slug", slugify(e.target.value)); }} /></label><label>Identificador único de tu negocio<input aria-invalid={Boolean(fieldErrors.slug)} minLength={3} pattern="[a-z0-9-]+" required value={draft.slug} onChange={(e) => update("slug", slugify(e.target.value))} /><small>Formará parte del enlace público. Elige uno corto y fácil de recordar. Ejemplo: {draft.slug || "tu-negocio"}.</small>{fieldErrors.slug ? <small className="field-error">{fieldErrors.slug}</small> : null}</label><label>¿Qué ofrece tu negocio?<textarea maxLength={1000} rows={4} value={draft.description} onChange={(e) => update("description", e.target.value)} /></label><div className="onboarding-grid"><label>Categoría<select required value={draft.platform_category_id} onChange={(e) => update("platform_category_id", e.target.value)}><option value="">Selecciona una categoría</option>{data?.categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label>Teléfono de contacto<input minLength={3} required value={draft.contact_phone} onChange={(e) => update("contact_phone", e.target.value)} /></label></div><label>Email público<input required type="email" value={draft.contact_email} onChange={(e) => update("contact_email", e.target.value)} /></label><label className="onboarding-check"><input checked={draft.sells_online} type="checkbox" onChange={(e) => update("sells_online", e.target.checked)} /><span><strong>Quiero vender online</strong><small>Activa carrito y pedidos para tus productos.</small></span></label>{error ? <div className="form-error">{error}</div> : null}<div className="onboarding-buttons"><button type="button" onClick={() => goTo(1)}>Atrás</button><button disabled={isSubmitting}>{isSubmitting ? "Validando…" : "Revisar pago →"}</button></div></form></> : null}
    {step === 3 ? <><p className="eyebrow">Activación</p><h1>Realiza el pago del plan.</h1><p>Transfiere el importe exacto y escribe el número de confirmación de la operación.</p><form onSubmit={submit}><div className="plan-options"><button className={draft.plan === "basic" ? "active" : ""} onClick={() => update("plan", "basic")} type="button"><span>Básico</span><strong>1500 CUP</strong></button><button className={draft.plan === "premium" ? "active" : ""} onClick={() => update("plan", "premium")} type="button"><span>Premium</span><strong>2500 CUP</strong></button></div><div className="payment-summary"><span>Saldo a pagar</span><strong>{onboardingService.price(draft.plan)} CUP</strong><hr/><span>Tarjeta de la plataforma</span><b>{data?.payment.bank_card ?? "Cargando…"}</b><span>Confirmar el pago al número</span><b>{data?.payment.confirmation_phone_number ?? "Cargando…"}</b></div><label>Número de confirmación de la transferencia<input aria-invalid={Boolean(fieldErrors.transaction_number)} maxLength={120} required value={draft.transaction_number} onChange={(e) => update("transaction_number", e.target.value)} />{fieldErrors.transaction_number ? <small className="field-error">{fieldErrors.transaction_number}</small> : null}</label>{error ? <div className="form-error">{error}</div> : null}<div className="onboarding-buttons"><button type="button" onClick={() => goTo(2)}>Atrás</button><button disabled={isSubmitting || !data}>{isSubmitting ? "Validando…" : "Confirmar y crear negocio"}</button></div></form></> : null}
  </section></main>;
}
