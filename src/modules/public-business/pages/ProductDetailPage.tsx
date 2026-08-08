"use client";

import Image from "next/image";
import Link from "next/link";
import { PublicProductCard } from "../components/PublicProductCard";
import { usePublicBusiness } from "../hooks/usePublicBusiness";
import { BusinessMaintenance } from "../components/BusinessMaintenance";

export function ProductDetailPage({ businessSlug, productSlug }: { businessSlug: string; productSlug: string }) {
  const store = usePublicBusiness(businessSlug);
  if (!store.data) return <main className="public-loading">{store.error ?? "Cargando producto…"}</main>;
  if (!store.data.business.is_published) return <BusinessMaintenance name={store.data.business.name} />;
  const product = store.data.catalog.items.find((item) => item.slug === productSlug);
  if (!product) return <main className="public-loading"><p>Este producto no está disponible.</p><Link href={`/bisne/${businessSlug}`}>Volver al negocio</Link></main>;
  const canOrder = store.data.business.sells_online;
  const related = store.data.catalog.items.filter((item) => item.id !== product.id && item.category_id === product.category_id).slice(0, 6);

  return (
    <main className="product-detail-page">
      <header className="product-detail-top"><Link href={`/bisne/${businessSlug}`}>← {store.data.business.name}</Link><Link href="/">El Bisne</Link>{canOrder ? <Link href={`/bisne/${businessSlug}/carrito`}>Carrito ({store.count})</Link> : null}</header>
      <section className="product-detail-layout">
        <div className="product-detail-image">{product.image_url ? <Image alt={product.name} fill priority sizes="(max-width: 780px) 100vw, 55vw" src={product.image_url} unoptimized /> : <span>{product.name.slice(0, 1)}</span>}<div className="product-image-badge">Selección de {store.data.business.name}</div></div>
        <div className="product-detail-copy">
          <div className="product-detail-kicker"><p className="eyebrow">Producto destacado</p><span className={product.is_available ? "available" : "unavailable"}>{product.is_available ? "Disponible" : "Agotado"}</span></div>
          <h1>{product.name}</h1>
          <strong className="product-detail-price">{product.price} {product.currency}</strong>
          <p className="product-detail-description">{product.description ?? "Contacta al negocio para conocer más detalles sobre este producto."}</p>
          <div className="product-seller-card"><span>{store.data.business.name.slice(0, 1)}</span><div><small>Ofrecido por</small><strong>{store.data.business.name}</strong><p>{canOrder ? "Este negocio acepta pedidos online." : "Catálogo disponible para consulta."}</p></div></div>
          {canOrder && product.is_available ? <div className="product-detail-visit"><p>Visita el negocio para seleccionar la cantidad y añadir este producto al carrito.</p><Link href={`/bisne/${businessSlug}#productos`}>Ir al negocio y comprar →</Link></div> : <div className="product-order-note">{product.is_available ? "Este negocio muestra su catálogo para consulta y no recibe pedidos desde la plataforma." : "Este producto no está disponible en este momento."}</div>}
        </div>
      </section>
      {related.length ? <section className="related-products"><div><p className="eyebrow">También puede interesarte</p><h2>Productos relacionados</h2></div><div className="product-slider">{related.map((item) => <PublicProductCard businessSlug={businessSlug} canOrder={false} key={item.id} onAdd={() => undefined} onSetQuantity={() => undefined} product={item} quantity={0} />)}</div></section> : null}
    </main>
  );
}
