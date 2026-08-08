import Image from "next/image";
import type { Business } from "@/modules/platform-admin/types/platform-admin.types";
import type { PublicService } from "../types/public-business.types";

function contactHref(business: Business, service: PublicService): string | null {
  const message = `Hola, me interesa el servicio "${service.name}" de ${business.name}. Quisiera más información.`;
  const phone = business.contact_phone?.replace(/\D/g, "");
  if (phone) return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  if (business.contact_email) return `mailto:${business.contact_email}?subject=${encodeURIComponent(`Consulta sobre ${service.name}`)}&body=${encodeURIComponent(message)}`;
  return null;
}

export function PublicServiceCard({ business, service }: { business: Business; service: PublicService }) {
  const href = contactHref(business, service);
  return <article className="public-service-card"><div className="public-service-image">{service.image_url ? <Image alt={service.name} fill sizes="(max-width: 780px) 100vw, 520px" src={service.image_url} unoptimized /> : <span>{service.name.slice(0, 1)}</span>}<small>Servicio</small></div><div className="public-service-copy"><h3>{service.name}</h3><p>{service.description ?? "Conversemos para conocer todos los detalles de este servicio."}</p><div className="service-facts">{service.duration_minutes ? <span>◷ {service.duration_minutes} min</span> : null}{service.price ? <strong>Desde {service.price} {service.currency}</strong> : <span>Precio a consultar</span>}</div>{href ? <a className="service-contact-button" href={href} rel="noreferrer" target={href.startsWith("https") ? "_blank" : undefined}>Consultar este servicio →</a> : null}</div></article>;
}
