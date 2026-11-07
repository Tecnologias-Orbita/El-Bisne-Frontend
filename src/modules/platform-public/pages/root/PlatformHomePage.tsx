"use client";

import { PublicAccessNav } from "@/shared/components/PublicAccessNav";
import ReducedLogo from "@/shared/components/ReducedLogo";
import { HorizontalRatioList } from "@/shared/ui/lists/HorizontalList";
import { HorizontalListItem } from "@/shared/ui/lists/HorizontalList.types";
import Image from "next/image";
import Link from "next/link";
import { DiscoverySlider } from "../../components/DiscoverySlider";
import { usePlatformDiscovery } from "../../hooks/usePlatformDiscovery";
import {
  DISCOVERY_TAB,
  type DiscoveryBusiness,
  type DiscoveryProduct,
  type DiscoveryService,
} from "../../types/platform-public.types";
import CallToAction from "./sections/CallToAction";
import HeroSection from "./sections/Hero";
import Title from "./sections/Title";

function BusinessLogo({
  compact = false,
  name,
  url,
}: {
  compact?: boolean;
  name: string;
  url: string | null;
}) {
  return (
    <span
      aria-hidden="true"
      className={`absolute left-[1rem] top-[1rem] z-10 grid h-[2.3rem] w-[2.3rem] place-items-center overflow-hidden rounded-full border-2 border-white/90 bg-lime-300 text-[0.78rem] text-[var(--green-dark)] shadow-[0_4px_16px_rgb(8_35_28_/_20%)] [font-weight:950] ${
        compact
          ? "!static !h-[1.8rem] !w-[1.8rem] flex-none !border !shadow-none !text-[0.65rem]"
          : ""
      }`}
    >
      {url ? (
        <Image
          alt=""
          className="h-full w-full object-cover transition-transform duration-[350ms] ease-[ease] group-hover:scale-[1.04]"
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
function BusinessCard({ business }: { business: DiscoveryBusiness }) {
  return (
    <Link
      className="group w-[min(82vw,25rem)] flex-none snap-start overflow-hidden rounded-[1.3rem] border border-[#e0e3da] bg-white text-inherit shadow-[0_14px_45px_rgb(28_52_40_/_7%)] no-underline transition-transform duration-200 ease-[ease] hover:-translate-y-1"
      href={`/bisne/${business.slug}`}
    >
      <div className="relative grid h-60 place-items-center overflow-hidden bg-[#e5eee8] text-[4rem] font-black text-green-600">
        {business.hero_image_url ? (
          <Image
            alt={business.name}
            className="h-full w-full object-cover transition-transform duration-[350ms] ease-[ease] group-hover:scale-[1.04]"
            fill
            sizes="(max-width: 780px) 82vw, 390px"
            src={business.hero_image_url}
            unoptimized
          />
        ) : (
          <span>{business.name.slice(0, 1)}</span>
        )}
        <BusinessLogo name={business.name} url={business.logo_url} />
      </div>
      <section className="grid gap-[0.6rem] p-[1.2rem]">
        <small className="text-[0.67rem] font-black uppercase text-green-600">
          Negocio local
        </small>
        <h3 className="m-0 min-h-[3.15rem] line-clamp-2 text-[1.3rem] leading-[1.22] [overflow-wrap:anywhere]">
          {business.name}
        </h3>
        <p className="m-0 min-h-[2.5rem] line-clamp-2 text-[0.78rem] leading-[1.55] text-[var(--muted)] [overflow-wrap:anywhere]">
          {business.description ?? "Descubre todo lo que ofrece este bisne."}
        </p>
        <strong className="mt-auto flex w-fit items-center justify-between gap-[0.8rem] rounded-[2rem] px-[0.85rem] py-[0.65rem] bg-green-600 !text-[0.72rem] !text-white [font-weight:900]">
          Visitar negocio <span className="not-italic">→</span>
        </strong>
      </section>
    </Link>
  );
}
function ProductCard({ product }: { product: DiscoveryProduct }) {
  const detailHref = `/bisne/${product.business_slug}/productos/${product.slug}`;
  return (
    <article className="group w-[min(76vw,20.5rem)] flex-none snap-start overflow-hidden rounded-[1.3rem] border border-[#e0e3da] bg-white text-inherit shadow-[0_14px_45px_rgb(28_52_40_/_7%)] no-underline transition-transform duration-200 ease-[ease] hover:-translate-y-1">
      <Link
        aria-label={`Ver ${product.name}`}
        className="relative grid h-[15.5rem] place-items-center overflow-hidden bg-[#e5eee8] text-[4rem] font-black text-green-600"
        href={detailHref}
      >
        {product.image_url ? (
          <Image
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-[350ms] ease-[ease] group-hover:scale-[1.04]"
            fill
            sizes="(max-width: 780px) 72vw, 290px"
            src={product.image_url}
            unoptimized
          />
        ) : (
          <span>{product.name.slice(0, 1)}</span>
        )}
      </Link>
      <section className="grid min-h-[13.25rem] grid-rows-[auto_auto_2.5rem_auto_1fr] gap-[0.6rem] p-[1.2rem]">
        <div className="flex min-w-0 items-center gap-[0.45rem]">
          <BusinessLogo
            compact
            name={product.business_name}
            url={product.business_logo_url}
          />
          <small className="min-w-0 truncate">{product.business_name}</small>
        </div>
        <Link className="text-inherit no-underline" href={detailHref}>
          <h3 className="m-0 min-h-[3.38rem] line-clamp-2 text-[1.3rem] leading-[1.3] [overflow-wrap:anywhere]">
            {product.name}
          </h3>
        </Link>
        <p className="m-0 min-h-[2.5rem] line-clamp-2 text-[0.78rem] leading-[1.55] text-[var(--muted)] [overflow-wrap:anywhere]">
          {product.description ?? "Consulta sus detalles."}
        </p>
        <strong className="text-[0.82rem] text-green-600">
          {product.price} {product.currency}
        </strong>
        <div className="mt-[0.35rem] flex self-end items-center justify-between gap-[0.75rem] border-t border-[var(--line)] pt-[0.85rem]">
          <Link
            className="rounded-[2rem] border border-green-600 px-[0.72rem] py-[0.58rem] text-center text-[0.7rem] font-black text-green-600 no-underline"
            href={detailHref}
          >
            Ver producto
          </Link>
          <Link
            className="rounded-[2rem] bg-green-600 px-[0.72rem] py-[0.58rem] text-center text-[0.7rem] font-black text-white no-underline"
            href={`/bisne/${product.business_slug}`}
          >
            Visitar negocio <span className="not-italic">→</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
function ServiceCard({ service }: { service: DiscoveryService }) {
  return (
    <Link
      className="w-[min(82vw,25rem)] flex-none overflow-hidden rounded-[1.3rem] border border-[#d8ded5] bg-[#f7f4ec] text-inherit no-underline"
      href={`/bisne/${service.business_slug}#servicios`}
    >
      <div className="relative grid h-60 place-items-center overflow-hidden bg-[#dfeae2] text-[4rem] font-black text-green-600">
        {service.image_url ? (
          <Image
            alt={service.name}
            className="h-full w-full object-cover"
            fill
            sizes="(max-width: 780px) 82vw, 390px"
            src={service.image_url}
            unoptimized
          />
        ) : (
          <span>{service.name.slice(0, 1)}</span>
        )}
        <b className="absolute right-[1rem] bottom-[1rem] rounded-[2rem] px-[0.65rem] py-[0.4rem] bg-lime-300 text-[0.65rem] font-bold uppercase text-[var(--green-dark)]">
          Servicio
        </b>
      </div>
      <section className="grid gap-[0.6rem] p-[1.2rem]">
        <div className="flex min-w-0 items-center gap-[0.45rem]">
          <BusinessLogo
            compact
            name={service.business_name}
            url={service.business_logo_url}
          />
          <small className="min-w-0 truncate text-green-600">
            {service.business_name}
          </small>
        </div>
        <h3 className="m-0 text-[2.5rem] font-bold">{service.name}</h3>
        <p className="m-0 min-h-[2.5rem] text-[0.78rem] leading-[1.55] text-[var(--muted)]">
          {service.description ??
            "Conoce este servicio y conversa con el negocio."}
        </p>
        <strong className="text-green-600">
          {service.price
            ? `Desde ${service.price} ${service.currency}`
            : "Consultar detalles"}
        </strong>
        <span className="mt-auto flex w-fit items-center justify-between gap-[0.8rem] rounded-[2rem] px-[0.85rem] py-[0.65rem] bg-green-600 text-[0.72rem] text-white [font-weight:900]">
          Visitar negocio <i className="not-italic">→</i>
        </span>
      </section>
    </Link>
  );
}

export function PlatformHomePage() {
  const store = usePlatformDiscovery();
  const TABS: HorizontalListItem[] = [
    {
      text: "Negocios",
      slug: DISCOVERY_TAB.BUSINESSES,
      active: store.tab === DISCOVERY_TAB.BUSINESSES,
    },
    {
      text: "Productos",
      slug: DISCOVERY_TAB.PRODUCTS,
      active: store.tab === DISCOVERY_TAB.PRODUCTS,
    },
    {
      text: "Servicios",
      slug: DISCOVERY_TAB.SERVICES,
      active: store.tab === DISCOVERY_TAB.SERVICES,
    },
  ];

  return (
    <main className="platform-public-page">
      <HeroSection />
      <Title />
      <PublicAccessNav
        logo={
          <div className="p-2 bg-white rounded-xl shadow-lg">
            <h4 className="leading-none font-black text-transparent bg-clip-text bg-linear-to-br from-green-700 via-green-500 via-75% to-lime-300">
              El Bisne
            </h4>
          </div>
        }
        mobileLogo={
          <ReducedLogo className="size-12 p-2 rounded-xl bg-white shadow-lg" />
        }
      />
      <section
        className="max-w-5xl scroll-mt-20 px-4 py-8 mx-auto"
        id="explore"
      >
        <article className="w-full flex flex-wrap justify-center md:justify-between items-center gap-4">
          <h3 className="text-center font-black text-green-600">
            ¿Qué estás buscando?
          </h3>
          <HorizontalRatioList
            className="shadow-lg"
            items={TABS}
            onChange={(i) => store.setTab(TABS[i].slug as DISCOVERY_TAB)}
          />
        </article>
        <section className="rounded-2xl border border-green-700/25 bg-white p-4 shadow-lg mt-4 grid gap-4">
          <label className="grid gap-2 text-gray-500 font-bold">
            Buscar por nombre
            <input
              className="w-full rounded-lg border-0 outline-none bg-cream-100 p-2 text-green-700"
              placeholder={
                store.tab === "businesses"
                  ? "Ej. Dulce Alma"
                  : store.tab === "products"
                    ? "Ej. Café latte"
                    : "Ej. Fotografía"
              }
              type="search"
              value={store.search}
              onChange={(event) => store.setSearch(event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-gray-500 font-bold">
            Categoría
            <select
              className="w-full rounded-lg border-0 outline-none bg-cream-100 p-2 text-green-700"
              value={store.categoryId}
              onChange={(event) => store.setCategoryId(event.target.value)}
            >
              <option value="">Todas las categorías</option>
              {store.data?.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </section>
        {store.error ? (
          <div className="mb-[1rem] flex items-center justify-between gap-[1rem] rounded-[0.8rem] px-[1rem] py-[0.85rem] bg-[#fbe9e7] text-[0.78rem] text-[#8c2d27]">
            {store.error}
          </div>
        ) : null}
        {store.isLoading ? (
          <div className="px-[5rem] py-[5rem] text-center text-[var(--muted)]">
            Buscando propuestas para ti…
          </div>
        ) : store.sections.length ? (
          <div className="grid gap-[clamp(4rem,7vw,7rem)]">
            {store.sections.map((section) => (
              <section className="min-w-0" key={section.category.id}>
                <div className="flex items-end justify-between px-[clamp(1.25rem,5vw,5rem)] pb-[1.4rem] [@media(min-width:781px)]:items-start">
                  <h2 className="mt-[0.4rem] mb-0 text-[clamp(2rem,4vw,3.5rem)] tracking-[-0.05em]">
                    {section.category.name}
                  </h2>
                </div>
                <DiscoverySlider label={section.category.name}>
                  {store.tab === "businesses"
                    ? (section.items as DiscoveryBusiness[]).map((item) => (
                        <BusinessCard business={item} key={item.id} />
                      ))
                    : store.tab === "products"
                      ? (section.items as DiscoveryProduct[]).map((item) => (
                          <ProductCard key={item.id} product={item} />
                        ))
                      : (section.items as DiscoveryService[]).map((item) => (
                          <ServiceCard key={item.id} service={item} />
                        ))}
                </DiscoverySlider>
              </section>
            ))}
          </div>
        ) : (
          <div className="px-[1rem] py-[3rem] text-center text-[var(--muted)]">
            No encontramos resultados con esos filtros.
          </div>
        )}
      </section>
      <CallToAction />
    </main>
  );
}
