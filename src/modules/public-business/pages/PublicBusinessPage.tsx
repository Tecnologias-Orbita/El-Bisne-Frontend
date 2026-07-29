"use client";

import Link from "next/link";
import { PublicProductCard } from "../components/PublicProductCard";
import { usePublicBusiness } from "../hooks/usePublicBusiness";

export function PublicBusinessPage({ slug }: { slug: string }) {
  const store = usePublicBusiness(slug);
  if (!store.data) return <main className="public-loading">{store.error ?? "Preparando este bisne…"}</main>;
  const { business, catalog } = store.data;
  const canOrder = business.business_type.toLocaleLowerCase("es") !== "restaurant";
  const sections = [
    ...catalog.categories.map((category) => ({ ...category, products: catalog.items.filter((product) => product.category_id === category.id) })),
    { id: "uncategorized", name: "Otros", slug: "otros", products: catalog.items.filter((product) => !product.category_id) },
  ].filter((section) => section.products.length);
  const productCard = (product: (typeof catalog.items)[number]) => (
    <PublicProductCard
      businessSlug={slug}
      canOrder={canOrder}
      key={product.id}
      onAdd={() => store.add(product)}
      onSetQuantity={(quantity) => store.setQuantity(product.id, quantity)}
      product={product}
      quantity={store.quantityFor(product.id)}
    />
  );

  return (
    <main className="public-business-page">
      <header className="public-business-top">
        <Link className="platform-home-link" href="/">El Bisne</Link>
        <button onClick={() => store.setSearchOpen(true)}>⌕ Buscar productos</button>
        {canOrder ? <Link href={`/bisne/${slug}/carrito`}>Carrito <b>{store.count}</b></Link> : null}
      </header>
      <section className="business-public-hero" style={business.site.hero_image_url ? { backgroundImage: `linear-gradient(180deg, rgb(5 20 14 / 15%), rgb(5 20 14 / 72%)), url(${business.site.hero_image_url})` } : undefined}><h1>{business.name}</h1></section>
      <section className="public-business-intro">
        <p className="eyebrow">Bienvenido a</p><h2>{business.name}</h2>
        <p className={store.descriptionOpen ? "expanded" : ""}>{business.description ?? "Descubre todo lo que este bisne tiene para ofrecerte."}</p>
        {business.description && business.description.length > 150 ? <button onClick={() => store.setDescriptionOpen(!store.descriptionOpen)}>{store.descriptionOpen ? "Mostrar menos" : "Mostrar más"}</button> : null}
      </section>
      <section className="public-catalog">{sections.map((section) => <div className="public-category-section" key={section.id}><div className="public-category-heading"><div><small>Categoría</small><h2>{section.name}</h2></div><span>{section.products.length} opciones</span></div><div className="product-slider">{section.products.map(productCard)}</div></div>)}</section>
      {!catalog.items.length ? <div className="public-empty">Este bisne todavía está preparando su catálogo.</div> : null}
      <section className="public-contact"><p className="eyebrow">Contacto</p><h2>Hablemos</h2><div>{business.contact_phone ? <a href={`tel:${business.contact_phone}`}>{business.contact_phone}</a> : null}{business.contact_email ? <a href={`mailto:${business.contact_email}`}>{business.contact_email}</a> : null}</div><p>{business.name} · {business.business_type}</p></section>
      {store.searchOpen ? <div className="public-search-overlay"><div className="public-search-panel"><header><h2>Buscar productos</h2><button onClick={() => store.setSearchOpen(false)}>×</button></header><input autoFocus placeholder="¿Qué estás buscando?" type="search" value={store.search} onChange={(event) => store.setSearch(event.target.value)} /><div className="public-search-results">{store.filtered.map(productCard)}</div></div></div> : null}
      {canOrder && store.count ? <Link className="floating-cart" href={`/bisne/${slug}/carrito`}><span>Ver carrito</span><strong>{store.count} · {store.total.toFixed(2)} {store.cart[0]?.product.currency}</strong></Link> : null}
    </main>
  );
}
