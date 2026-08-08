import Image from "next/image";
import Link from "next/link";
import type { PublicProduct } from "../types/public-business.types";
import { QuantitySelector } from "./QuantitySelector";

type Props = {
  businessSlug: string;
  product: PublicProduct;
  canOrder: boolean;
  quantity: number;
  onAdd: () => void;
  onSetQuantity: (quantity: number) => void;
};

export function PublicProductCard({ businessSlug, product, canOrder, quantity, onAdd, onSetQuantity }: Props) {
  const detailHref = `/bisne/${businessSlug}/productos/${product.slug}`;
  return (
    <article className="public-product-card">
      <Link aria-label={`Ver detalles de ${product.name}`} className="public-product-image" href={detailHref}>
        {product.image_url ? <Image alt={product.name} fill sizes="(max-width: 780px) 78vw, 320px" src={product.image_url} unoptimized /> : product.name.slice(0, 1)}
      </Link>
      <div className="public-product-copy">
        <small>Producto</small>
        <Link className="public-product-title" href={detailHref}><h3>{product.name}</h3></Link>
        <p>{product.description ?? "Consulta todos los detalles de este producto."}</p>
        <div>
          <strong>{product.price} {product.currency}</strong>
          {canOrder ? quantity > 0 ? (
            <QuantitySelector quantity={quantity} onDecrease={() => onSetQuantity(quantity - 1)} onIncrease={() => onSetQuantity(quantity + 1)} />
          ) : (
            <button disabled={!product.is_available} onClick={onAdd} type="button">{product.is_available ? "Añadir" : "Agotado"}</button>
          ) : <Link className="product-detail-link" href={detailHref}>Ver detalles</Link>}
        </div>
      </div>
    </article>
  );
}
