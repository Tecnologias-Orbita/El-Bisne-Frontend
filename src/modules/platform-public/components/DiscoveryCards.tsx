import Image from "next/image";
import Link from "next/link";
import type {
  DiscoveryBusiness,
  DiscoveryProduct,
  DiscoveryService,
} from "../types/platform-public.types";

type DiscoveryImageProps = {
  alt: string;
  fallback: string;
  imageUrl: string | null;
  sizes: string;
};

function DiscoveryImage({
  alt,
  fallback,
  imageUrl,
  sizes,
}: DiscoveryImageProps) {
  if (!imageUrl) return <span>{fallback}</span>;

  return (
    <Image
      alt={alt}
      className="h-full w-full object-cover"
      fill
      sizes={sizes}
      src={imageUrl}
      unoptimized
    />
  );
}

type BusinessMarkProps = {
  appearance: "overlay" | "inline";
  name: string;
  url: string | null;
};

const BUSINESS_MARK_STYLES = {
  overlay:
    "absolute left-[1rem] top-[1rem] z-10 grid size-[2.3rem] place-items-center overflow-hidden rounded-full border-2 border-white/90 bg-lime-300 text-[0.78rem] text-(--green-dark) shadow-[0_4px_16px_rgb(8_35_28/20%)] [font-weight:950]",
  inline:
    "grid size-[1.8rem] flex-none place-items-center overflow-hidden rounded-full border border-white bg-lime-300 text-[0.65rem] text-[var(--green-dark)] [font-weight:950]",
} satisfies Record<BusinessMarkProps["appearance"], string>;

function BusinessMark({ appearance, name, url }: BusinessMarkProps) {
  return (
    <span aria-hidden="true" className={BUSINESS_MARK_STYLES[appearance]}>
      {url ? (
        <Image
          alt=""
          className="h-full w-full object-cover"
          height={32}
          src={url}
          unoptimized
          width={32}
        />
      ) : (
        name.slice(0, 1)
      )}
    </span>
  );
}

function BusinessIdentity({
  name,
  tone = "default",
  url,
}: {
  name: string;
  tone?: "default" | "green";
  url: string | null;
}) {
  return (
    <div className="flex min-w-0 items-center gap-[0.45rem]">
      <BusinessMark appearance="inline" name={name} url={url} />
      <small
        className={`min-w-0 truncate ${tone === "green" ? "text-green-600" : ""}`}
      >
        {name}
      </small>
    </div>
  );
}

export function BusinessDiscoveryCard({
  business,
}: {
  business: DiscoveryBusiness;
}) {
  return (
    <Link
      className="w-[min(82vw,25rem)] flex-none snap-start overflow-hidden rounded-[1.3rem] border border-[#e0e3da] bg-white text-inherit shadow-[0_14px_45px_rgb(28_52_40/7%)] no-underline"
      href={`/bisne/${business.slug}`}
    >
      <div className="relative grid h-60 place-items-center overflow-hidden bg-[#e5eee8] text-[4rem] font-black text-green-600">
        <DiscoveryImage
          alt={business.name}
          fallback={business.name.slice(0, 1)}
          imageUrl={business.hero_image_url}
          sizes="(max-width: 780px) 82vw, 390px"
        />
        <BusinessMark
          appearance="overlay"
          name={business.name}
          url={business.logo_url}
        />
      </div>
      <section className="grid gap-[0.6rem] p-[1.2rem]">
        <small className="text-[0.67rem] font-black uppercase text-green-600">
          Negocio local
        </small>
        <h3 className="m-0 min-h-[3.15rem] line-clamp-2 text-[1.3rem] leading-[1.22] wrap-anywhere">
          {business.name}
        </h3>
        <p className="m-0 min-h-10 line-clamp-2 text-[0.78rem] leading-[1.55] text-(--muted) wrap-anywhere">
          {business.description ?? "Descubre todo lo que ofrece este bisne."}
        </p>
        <strong className="mt-auto flex w-fit items-center justify-between gap-[0.8rem] rounded-4xl px-[0.85rem] py-[0.65rem] bg-green-600 text-[0.72rem]! text-white! font-black">
          Visitar negocio <span className="not-italic">→</span>
        </strong>
      </section>
    </Link>
  );
}

export function ProductDiscoveryCard({
  product,
}: {
  product: DiscoveryProduct;
}) {
  const detailHref = `/bisne/${product.business_slug}/productos/${product.slug}`;

  return (
    <article className="w-[min(76vw,20.5rem)] flex-none snap-start overflow-hidden rounded-[1.3rem] border border-[#e0e3da] bg-white text-inherit shadow-[0_14px_45px_rgb(28_52_40/7%)] no-underline">
      <Link
        aria-label={`Ver ${product.name}`}
        className="relative grid h-62 place-items-center overflow-hidden bg-[#e5eee8] text-[4rem] font-black text-green-600"
        href={detailHref}
      >
        <DiscoveryImage
          alt={product.name}
          fallback={product.name.slice(0, 1)}
          imageUrl={product.image_url}
          sizes="(max-width: 780px) 72vw, 290px"
        />
      </Link>
      <section className="grid min-h-53 grid-rows-[auto_auto_2.5rem_auto_1fr] gap-[0.6rem] p-[1.2rem]">
        <BusinessIdentity
          name={product.business_name}
          url={product.business_logo_url}
        />
        <Link className="text-inherit no-underline" href={detailHref}>
          <h3 className="m-0 min-h-[3.38rem] line-clamp-2 text-[1.3rem] leading-[1.3] wrap-anywhere">
            {product.name}
          </h3>
        </Link>
        <p className="m-0 min-h-10 line-clamp-2 text-[0.78rem] leading-[1.55] text-(--muted) wrap-anywhere">
          {product.description ?? "Consulta sus detalles."}
        </p>
        <strong className="text-[0.82rem] text-green-600">
          {product.price} {product.currency}
        </strong>
        <div className="mt-[0.35rem] flex self-end items-center justify-between gap-3 border-t border-(--line) pt-[0.85rem]">
          <Link
            className="rounded-4xl border border-green-600 px-[0.72rem] py-[0.58rem] text-center text-[0.7rem] font-black text-green-600 no-underline"
            href={detailHref}
          >
            Ver producto
          </Link>
          <Link
            className="rounded-4xl bg-green-600 px-[0.72rem] py-[0.58rem] text-center text-[0.7rem] font-black text-white no-underline"
            href={`/bisne/${product.business_slug}`}
          >
            Visitar negocio <span className="not-italic">→</span>
          </Link>
        </div>
      </section>
    </article>
  );
}

export function ServiceDiscoveryCard({
  service,
}: {
  service: DiscoveryService;
}) {
  return (
    <Link
      className="w-[min(82vw,25rem)] flex-none overflow-hidden rounded-[1.3rem] border border-[#d8ded5] bg-white text-inherit no-underline"
      href={`/bisne/${service.business_slug}#servicios`}
    >
      <div className="relative grid h-60 place-items-center overflow-hidden bg-[#dfeae2] text-[4rem] font-black text-green-600">
        <DiscoveryImage
          alt={service.name}
          fallback={service.name.slice(0, 1)}
          imageUrl={service.image_url}
          sizes="(max-width: 780px) 82vw, 390px"
        />
        <b className="absolute right-4 bottom-4 rounded-4xl px-[0.65rem] py-[0.4rem] bg-lime-300 text-[0.65rem] font-bold uppercase text-(--green-dark)">
          Servicio
        </b>
      </div>
      <section className="grid gap-[0.6rem] p-[1.2rem]">
        <BusinessIdentity
          name={service.business_name}
          tone="green"
          url={service.business_logo_url}
        />
        <h3 className="m-0 text-[2.5rem] font-bold wrap-anywhere">
          {service.name}
        </h3>
        <p className="m-0 min-h-10 text-[0.78rem] leading-[1.55] text-(--muted) wrap-anywhere">
          {service.description ??
            "Conoce este servicio y conversa con el negocio."}
        </p>
        <strong className="text-green-600">
          {service.price
            ? `Desde ${service.price}${service.currency ? ` ${service.currency}` : ""}`
            : "Consultar detalles"}
        </strong>
        <span className="mt-auto flex w-fit items-center justify-between gap-[0.8rem] rounded-4xl px-[0.85rem] py-[0.65rem] bg-green-600 text-[0.72rem] text-white font-black">
          Visitar negocio <i className="not-italic">→</i>
        </span>
      </section>
    </Link>
  );
}
