"use client";

import Image from "next/image";
import Link from "next/link";
import { PublicProductCard } from "../components/PublicProductCard";
import { QuantitySelector } from "../components/QuantitySelector";
import { usePublicBusiness } from "../hooks/usePublicBusiness";

export function ProductDetailPage({ businessSlug, productSlug }: { businessSlug: string; productSlug: string }) {
  const store = usePublicBusiness(businessSlug);
  if (!store.data) return <main className="public-loading">{store.error ?? "Cargando producto…"}</main>;
  const product = store.data.catalog.items.find((item) => item.slug === productSlug);
  if (!product) return <main className="public-loading"><p>Este producto no está disponible.</p><Link href={`/bisne/${businessSlug}`}>Volver al negocio</Link></main>;
  const canOrder = store.data.business.business_type.toLocaleLowerCase("es") !== "restaurant";
  const quantity = store.quantityFor(product.id);
  const related = store.data.catalog.items.filter((item) => item.id !== product.id && item.category_id === product.category_id).slice(0, 6);

  return (
    <main className="product-detail-page">
      <header className="product-detail-top"><Link href={`/bisne/${businessSlug}`}>← {store.data.business.name}</Link><Link href="/">El Bisne</Link>{canOrder ? <Link href={`/bisne/${businessSlug}/carrito`}>Carrito ({store.count})</Link> : null}</header>
      <section className="product-detail-layout">
        <div className="product-detail-image">{product.image_url ? <Image alt={product.name} fill priority sizes="(max-width: 780px) 100vw, 55vw" src={product.image_url} unoptimized /> : <span>{product.name.slice(0, 1)}</span>}</div>
        <div className="product-detail-copy">
          <p className="eyebrow">{product.product_type}</p>
          <h1>{product.name}</h1>
          <strong className="product-detail-price">{product.price} {product.currency}</strong>
          <p className="product-detail-description">{product.description ?? "Contacta al negocio para conocer más detalles sobre este producto."}</p>
          <dl><div><dt>Disponibilidad</dt><dd>{product.is_available ? "Disponible" : "Agotado"}</dd></div><div><dt>Tipo</dt><dd>{product.product_type}</dd></div><div><dt>Vendido por</dt><dd>{store.data.business.name}</dd></div></dl>
          {canOrder ? <div className="product-detail-action">{quantity ? <QuantitySelector quantity={quantity} onDecrease={() => store.setQuantity(product.id, quantity - 1)} onIncrease={() => store.setQuantity(product.id, quantity + 1)} /> : <button disabled={!product.is_available} onClick={() => store.add(product)}>{product.is_available ? "Añadir al carrito" : "Producto agotado"}</button>}{quantity ? <Link href={`/bisne/${businessSlug}/carrito`}>Ir al carrito</Link> : null}</div> : <div className="product-order-note">Este negocio muestra su catálogo para consulta y no recibe pedidos desde la plataforma.</div>}
        </div>
      </section>
      {related.length ? <section className="related-products"><div><p className="eyebrow">También puede interesarte</p><h2>Productos relacionados</h2></div><div className="product-slider">{related.map((item) => <PublicProductCard businessSlug={businessSlug} canOrder={canOrder} key={item.id} onAdd={() => store.add(item)} onSetQuantity={(next) => store.setQuantity(item.id, next)} product={item} quantity={store.quantityFor(item.id)} />)}</div></section> : null}
      {canOrder && store.count ? <Link className="floating-cart" href={`/bisne/${businessSlug}/carrito`}><span>Ver carrito</span><strong>{store.count} · {store.total.toFixed(2)} {store.cart[0]?.product.currency}</strong></Link> : null}
    </main>
  );
}
