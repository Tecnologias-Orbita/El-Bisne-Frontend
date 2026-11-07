"use client";

import { PublicAccessNav } from "@/shared/components/PublicAccessNav";
import ReducedLogo from "@/shared/components/ReducedLogo";
import { HorizontalRatioList } from "@/shared/ui/lists/HorizontalList";
import type { HorizontalListItem } from "@/shared/ui/lists/HorizontalList.types";
import {
  BusinessDiscoveryCard,
  ProductDiscoveryCard,
  ServiceDiscoveryCard,
} from "../../components/DiscoveryCards";
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
      <section className="max-w-5xl px-4 py-8 mx-auto" id="explore">
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
          <div className="mt-8 flex items-center justify-between gap-4 rounded-lg px-4 py-2 bg-cream-100 text-sm text-red-400">
            {store.error}
          </div>
        ) : null}
        {store.isLoading ? (
          <div className="px-4 py-2 text-center text-gray-400 mt-8">
            Buscando propuestas para ti…
          </div>
        ) : store.sections.length ? (
          <div className="grid gap-4 mt-8 max-w-full">
            {store.sections.map((section) => (
              <section
                className="grid gap-4 max-w-full min-w-0"
                key={section.category.id}
              >
                <h3 className="border-l-4 border-lime-500 text-green-600 font-black leading-none px-4 py-2">
                  {section.category.name}
                </h3>
                <DiscoverySlider label={section.category.name}>
                  {store.tab === "businesses"
                    ? (section.items as DiscoveryBusiness[]).map((item) => (
                        <BusinessDiscoveryCard business={item} key={item.id} />
                      ))
                    : store.tab === "products"
                      ? (section.items as DiscoveryProduct[]).map((item) => (
                          <ProductDiscoveryCard key={item.id} product={item} />
                        ))
                      : (section.items as DiscoveryService[]).map((item) => (
                          <ServiceDiscoveryCard key={item.id} service={item} />
                        ))}
                </DiscoverySlider>
              </section>
            ))}
          </div>
        ) : (
          <div className="mt-8 px-4 py-2 text-center text-gray-400">
            No encontramos resultados con esos filtros.
          </div>
        )}
      </section>
      <CallToAction />
    </main>
  );
}
