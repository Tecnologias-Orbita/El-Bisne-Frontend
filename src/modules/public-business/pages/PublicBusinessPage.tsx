"use client";

import Link from "next/link";
import { PublicProductCard } from "../components/PublicProductCard";
import { PublicServiceCard } from "../components/PublicServiceCard";
import { usePublicBusiness } from "../hooks/usePublicBusiness";

export function PublicBusinessPage({ slug }: { slug: string }) {
  const store = usePublicBusiness(slug);
  if (!store.data) return <main className="public-loading">{store.error ?? "Preparando este bisne…"}</main>;
  const { business, catalog, services } = store.data;
  const canOrder = business.sells_online;
  const whatsappPhone = business.contact_phone?.replace(/\D/g, "");
  const whatsappMessage = encodeURIComponent(`Hola, quisiera información sobre ${business.name}.`);
  const sections = [...catalog.categories.map((category) => ({ ...category, products: catalog.items.filter((product) => product.category_id === category.id) })), { id: "uncategorized", name: "Otros", slug: "otros", products: catalog.items.filter((product) => !product.category_id) }].filter((section) => section.products.length);
  const productCard = (product: (typeof catalog.items)[number]) => <PublicProductCard businessSlug={slug} canOrder={canOrder} key={product.id} onAdd={() => store.add(product)} onSetQuantity={(quantity) => store.setQuantity(product.id, quantity)} product={product} quantity={store.quantityFor(product.id)} />;

  return <main className="public-business-page">
    <header className="public-business-top"><Link className="platform-home-link" href="/">El Bisne</Link><button onClick={() => store.setSearchOpen(true)}>⌕ Buscar ofertas</button>{canOrder ? <Link href={`/bisne/${slug}/carrito`}>Carrito <b>{store.count}</b></Link> : null}</header>
    <section className="business-public-hero" style={business.site.hero_image_url ? { backgroundImage: `linear-gradient(180deg, rgb(5 20 14 / 15%), rgb(5 20 14 / 72%)), url(${business.site.hero_image_url})` } : undefined}><h1>{business.name}</h1></section>
    <section className="public-business-intro"><p className="eyebrow">Bienvenido a</p><h2>{business.name}</h2><p className={store.descriptionOpen ? "expanded" : ""}>{business.description ?? "Descubre todo lo que este bisne tiene para ofrecerte."}</p>{business.description && business.description.length > 150 ? <button onClick={() => store.setDescriptionOpen(!store.descriptionOpen)}>{store.descriptionOpen ? "Mostrar menos" : "Mostrar más"}</button> : null}</section>
    {catalog.items.length ? <section className="public-catalog" id="productos"><div className="offer-section-intro"><p className="eyebrow">Catálogo</p><h2>Productos</h2><p>Artículos disponibles en {business.name}.</p></div>{sections.map((section) => <div className="public-category-section" key={section.id}><div className="public-category-heading"><div><small>Categoría</small><h2>{section.name}</h2></div><span>{section.products.length} opciones</span></div><div className="product-slider">{section.products.map(productCard)}</div></div>)}</section> : null}
    {services.length ? <section className="public-services" id="servicios"><div className="service-section-heading"><p className="eyebrow">Experiencia y atención</p><h2>Servicios pensados para ti</h2><p>Conoce cómo podemos ayudarte y conversa directamente con nuestro equipo.</p></div><div className="service-grid">{services.map((service) => <PublicServiceCard business={business} key={service.id} service={service} />)}</div></section> : null}
    {!catalog.items.length && !services.length ? <div className="public-empty">Este bisne todavía está preparando lo que ofrece.</div> : null}
    <section className="public-contact"><p className="eyebrow">Contacto</p><h2>Hablemos</h2><div>{business.contact_phone && whatsappPhone ? <a className="whatsapp-contact" href={`https://wa.me/${whatsappPhone}?text=${whatsappMessage}`} rel="noreferrer" target="_blank"><svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 3a13 13 0 0 0-11.1 19.7L3 29l6.5-1.7A13 13 0 1 0 16 3Zm0 23.6c-2 0-4-.6-5.7-1.6l-.4-.2-3.8 1 1-3.7-.3-.4A10.6 10.6 0 1 1 16 26.6Zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1-2-.8-3.5-2.2-4.5-4-.2-.3 0-.5.1-.7l.5-.6.3-.6c.1-.2 0-.5 0-.6l-1-2.4c-.3-.6-.6-.5-.8-.5h-.7c-.3 0-.7.1-1 .5-1 1-1.5 2.3-1.5 3.7 0 2.2 1.6 4.4 1.8 4.7.2.3 3.2 4.9 7.8 6.8 2.9 1.2 4.6 1.3 6.3.8 1-.3 1.9-1.5 2.1-2.8.2-1.2.2-2.2-.1-2.4-.2-.1-.4-.2-.7-.4Z" /></svg><span>{business.contact_phone}</span></a> : null}{business.contact_email ? <a href={`mailto:${business.contact_email}`}>{business.contact_email}</a> : null}</div><p>{business.name}</p></section>
    {store.searchOpen ? <div className="public-search-overlay"><div className="public-search-panel"><header><h2>Buscar</h2><button onClick={() => store.setSearchOpen(false)}>×</button></header><input autoFocus placeholder="¿Qué estás buscando?" type="search" value={store.search} onChange={(event) => store.setSearch(event.target.value)} />{store.filtered.length ? <><h3>Productos</h3><div className="public-search-results">{store.filtered.map(productCard)}</div></> : null}{store.filteredServices.length ? <><h3>Servicios</h3><div className="service-grid compact">{store.filteredServices.map((service) => <PublicServiceCard business={business} key={service.id} service={service} />)}</div></> : null}{!store.filtered.length && !store.filteredServices.length ? <div className="public-empty">No encontramos coincidencias.</div> : null}</div></div> : null}
    {canOrder && store.count ? <Link className="floating-cart" href={`/bisne/${slug}/carrito`}><span>Ver carrito</span><strong>{store.count} · {store.total.toFixed(2)} {store.cart[0]?.product.currency}</strong></Link> : null}
  </main>;
}
