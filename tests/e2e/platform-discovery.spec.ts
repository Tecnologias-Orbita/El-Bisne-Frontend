import { expect, test, type Page } from "@playwright/test";

const categoryId = "cafe-category";

const discoveryData = {
  categories: [
    {
      id: categoryId,
      name: "Cafeterías",
      slug: "cafeterias",
      description: null,
      is_active: true,
    },
  ],
  businesses: Array.from({ length: 3 }, (_, index) => ({
    id: `business-${index}`,
    name: `Café ${index + 1}`,
    slug: `cafe-${index + 1}`,
    description: "Café de prueba para el carrusel.",
    sells_online: false,
    platform_category_id: categoryId,
    hero_image_url: null,
    logo_url: null,
  })),
  products: Array.from({ length: 3 }, (_, index) => ({
    id: `product-${index}`,
    business_id: `business-${index}`,
    business_name: `Café ${index + 1}`,
    business_slug: `cafe-${index + 1}`,
    platform_category_id: categoryId,
    name: `Producto ${index + 1}`,
    slug: `producto-${index + 1}`,
    description: "Producto de prueba para el carrusel.",
    price: "250",
    currency: "CUP",
    image_url: null,
    is_available: true,
    business_logo_url: null,
  })),
  services: Array.from({ length: 3 }, (_, index) => ({
    id: `service-${index}`,
    business_id: `business-${index}`,
    business_name: `Café ${index + 1}`,
    business_slug: `cafe-${index + 1}`,
    platform_category_id: categoryId,
    name: `Servicio ${index + 1}`,
    slug: `servicio-${index + 1}`,
    description: "Servicio de prueba para el carrusel.",
    price: "500",
    currency: "CUP",
    duration_minutes: 30,
    image_url: null,
    business_logo_url: null,
  })),
};

async function openDiscoveryPage(
  page: Page,
  viewport: { width: number; height: number },
) {
  await page.setViewportSize(viewport);
  await page.route("**/public/businesses/discovery**", (route) =>
    route.fulfill({ json: discoveryData }),
  );
  await page.goto("/welcome");
  await expect
    .poll(
      async () =>
        (await page.context().cookies()).find(
          ({ name }) => name === "__hasEverVisited",
        )?.value,
    )
    .toBe("true");
  await page.getByRole("link", { name: /continuar comprando/i }).click();
  await expect(page.getByRole("region", { name: "Cafeterías" })).toBeVisible();
}

async function getDiscoveryLayout(page: Page) {
  return page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    exploreWidth:
      document.querySelector("#explore")?.getBoundingClientRect().width ?? 0,
    sectionWidth:
      document
        .querySelector("#explore > div > section")
        ?.getBoundingClientRect().width ?? 0,
    sliderWidth: document.querySelector(".discovery-slider")?.clientWidth ?? 0,
    cardWidth:
      document.querySelector(".discovery-slider > *")?.getBoundingClientRect()
        .width ?? 0,
  }));
}

test.describe("Platform discovery responsive layout", () => {
  test("keeps cards and the page within the mobile viewport across tabs", async ({
    page,
  }) => {
    await openDiscoveryPage(page, { width: 390, height: 844 });

    for (const tab of ["Negocios", "Productos", "Servicios"]) {
      await page.getByRole("button", { name: tab, exact: true }).click();
      await expect(page.locator(".discovery-slider > *")).toHaveCount(3);

      const layout = await getDiscoveryLayout(page);
      expect(layout.documentWidth).toBeLessThanOrEqual(layout.clientWidth);
      expect(layout.sectionWidth).toBeLessThanOrEqual(layout.exploreWidth);
      expect(layout.cardWidth).toBeLessThanOrEqual(layout.sliderWidth);
    }
  });

  test("constrains desktop cards and keeps the explore anchor below the sticky nav", async ({
    page,
  }) => {
    await openDiscoveryPage(page, { width: 1440, height: 900 });
    await page.evaluate(() =>
      document
        .querySelector("#explore")
        ?.scrollIntoView({ block: "start", behavior: "instant" }),
    );

    const layout = await getDiscoveryLayout(page);
    const anchorLayout = await page.evaluate(() => ({
      exploreTop:
        document.querySelector("#explore")?.getBoundingClientRect().top ?? 0,
      navBottom:
        document.querySelector(".__navbar")?.getBoundingClientRect().bottom ??
        0,
    }));

    expect(layout.documentWidth).toBeLessThanOrEqual(layout.clientWidth);
    expect(layout.sectionWidth).toBeLessThanOrEqual(layout.exploreWidth);
    expect(layout.cardWidth).toBeLessThanOrEqual(layout.sliderWidth);
    expect(anchorLayout.exploreTop).toBeGreaterThanOrEqual(
      anchorLayout.navBottom,
    );
    await page
      .getByRole("button", { name: "Ver siguientes en Cafeterías" })
      .click();
    await expect(
      page.getByRole("button", { name: "Ver anteriores en Cafeterías" }),
    ).toBeVisible();
  });
});
