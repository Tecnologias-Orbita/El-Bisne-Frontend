const API_PREFIX = "/api/backend";

function parseInput(input: string | URL): URL {
  if (input instanceof URL) return input;
  return new URL(input, "http://localhost");
}

function getApiPath(pathname: string): string {
  return pathname.startsWith(API_PREFIX) ? pathname.slice(API_PREFIX.length) : pathname;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const now = new Date().toISOString();

const mockBusinesses = [
  {
    id: "1",
    name: "Restaurante El Buen Sabor",
    slug: "el-buen-sabor",
    description: "Comida cubana tradicional con los mejores sabores de la isla.",
    sells_online: true,
    currency: "CUP",
    timezone: "America/Havana",
    contact_email: "contacto@elbuensabor.com",
    contact_phone: "+53 5555-1234",
    is_published: true,
    platform_category_id: "1",
    site: { hero_image_url: "https://example.com/hero.jpg", logo_url: "https://example.com/logo.jpg" },
  },
  {
    id: "2",
    name: "Café La Estrella",
    slug: "cafe-la-estrella",
    description: "Café y repostería artesanal.",
    sells_online: false,
    currency: "USD",
    timezone: "America/Havana",
    contact_email: "info@cafelaestrella.com",
    contact_phone: "+53 5555-5678",
    is_published: true,
    platform_category_id: "2",
    site: { hero_image_url: null, logo_url: null },
  },
];

const mockPlatformCategories = [
  { id: "1", name: "Restaurantes", slug: "restaurantes", description: "Restaurantes y comida", is_active: true },
  { id: "2", name: "Cafeterías", slug: "cafeterias", description: "Cafeterías y repostería", is_active: true },
  { id: "3", name: "Servicios", slug: "servicios", description: "Servicios profesionales", is_active: true },
];

const mockBusinessCategories: Record<string, { id: string; name: string; slug: string; image_url: string | null; description: string | null; position: number; is_visible: boolean }[]> = {
  "1": [
    { id: "1", name: "Platos Fuertes", slug: "platos-fuertes", image_url: null, description: "Nuestros mejores platos", position: 1, is_visible: true },
    { id: "2", name: "Entradas", slug: "entradas", image_url: null, description: "Para comenzar", position: 2, is_visible: true },
  ],
  "2": [
    { id: "3", name: "Cafés", slug: "cafes", image_url: null, description: "Variedad de cafés", position: 1, is_visible: true },
  ],
};

const mockProducts: Record<string, { id: string; category_id: string | null; platform_category_id: string | null; name: string; slug: string; description: string | null; price: string; currency: string; image_url: string | null; is_available: boolean; is_published: boolean; track_inventory: boolean; stock_quantity: number | null }[]> = {
  "1": [
    { id: "1", category_id: "1", platform_category_id: null, name: "Ropa Vieja", slug: "ropa-vieja", description: "Nuestro plato estrella", price: "350.00", currency: "CUP", image_url: null, is_available: true, is_published: true, track_inventory: true, stock_quantity: 20 },
    { id: "2", category_id: "2", platform_category_id: null, name: "Tostones", slug: "tostones", description: "Plátanos fritos", price: "150.00", currency: "CUP", image_url: null, is_available: true, is_published: true, track_inventory: false, stock_quantity: null },
  ],
};

const mockServices: Record<string, { id: string; category_id: string | null; platform_category_id: string | null; name: string; slug: string; description: string | null; price: string | null; currency: string | null; duration_minutes: number | null; image_url: string | null; is_available: boolean; is_published: boolean }[]> = {
  "1": [
    { id: "1", category_id: null, platform_category_id: null, name: "Catering para eventos", slug: "catering-eventos", description: "Servicio de catering", price: "5000.00", currency: "CUP", duration_minutes: 180, image_url: null, is_available: true, is_published: true },
  ],
};

const mockMembers: Record<string, { id: string; user_id: string; email: string; full_name: string; role: string }[]> = {
  "1": [
    { id: "1", user_id: "1", email: "admin@test.com", full_name: "Admin User", role: "admin" },
    { id: "2", user_id: "2", email: "editor@test.com", full_name: "Editor User", role: "editor" },
  ],
};

const mockOrders: Record<string, { id: string; order_number: string; status: string; currency: string; subtotal: string; total: string }[]> = {
  "1": [
    { id: "1", order_number: "ORD-001", status: "pending", currency: "CUP", subtotal: "350.00", total: "350.00" },
    { id: "2", order_number: "ORD-002", status: "completed", currency: "CUP", subtotal: "500.00", total: "500.00" },
  ],
};

const mockPayments: Record<string, { id: string; business_id: string; transaction_number: string; plan: string; phone_number: string; execution_date: string; expiration_date: string; amount_paid: string; created_at: string }[]> = {
  "1": [
    { id: "1", business_id: "1", transaction_number: "TXN-001", plan: "basic", phone_number: "+53 5555-1234", execution_date: "2024-01-01", expiration_date: "2024-01-31", amount_paid: "1500.00", created_at: "2024-01-01T00:00:00Z" },
  ],
};

const mockAnalytics = { visits: 1250, product_views: 3400, orders: 45, completed_orders: 38, conversion_rate: 8.4 };

const mockPaymentSettings = { bank_card: "9222-8888-4444-3333", confirmation_phone_number: "+53 5555-0000" };

const mockExchangeRates = [
  { id: "1", currency: "USD", value_in_cup: "120.00" },
  { id: "2", currency: "EUR", value_in_cup: "130.00" },
];

const mockTokenPair = {
  access_token: "mock-access-token-" + Date.now(),
  refresh_token: "mock-refresh-token-" + Date.now(),
  token_type: "bearer",
};

const mockAuthenticatedUser = {
  id: "1",
  email: "admin@test.com",
  full_name: "Admin User",
  is_platform_admin: true,
};

const mockDiscovery = {
  categories: mockPlatformCategories,
  businesses: mockBusinesses.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    description: b.description,
    sells_online: b.sells_online,
    platform_category_id: b.platform_category_id,
    hero_image_url: b.site.hero_image_url,
    logo_url: b.site.logo_url,
  })),
  products: Object.values(mockProducts).flat(),
  services: Object.values(mockServices).flat(),
};

const mockPublicCatalog = {
  business_id: "1",
  business_name: "Restaurante El Buen Sabor",
  categories: mockBusinessCategories["1"].map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
  items: mockProducts["1"],
  total: mockProducts["1"].length,
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function noContent(): Response {
  return new Response(null, { status: 204 });
}

function notFound(): Response {
  return json({ detail: "Not found" }, 404);
}

// ─── Resolver ───────────────────────────────────────────────────────────────

export const localApiResolver = async (input: string | URL, init?: RequestInit): Promise<Response> => {
  const url = parseInput(input);
  const method = (init?.method ?? "GET").toUpperCase();
  const pathname = url.pathname;
  const apiPath = getApiPath(pathname);

  // ─── Health ──────────────────────────────────────────────────────────────
  if (method === "GET" && apiPath === "/health") {
    return json({ status: "ok" });
  }

  // ─── Auth ────────────────────────────────────────────────────────────────
  if (method === "POST" && apiPath === "/auth/login") {
    return json(mockTokenPair);
  }

  if (method === "GET" && apiPath === "/auth/me") {
    return json(mockAuthenticatedUser);
  }

  if (method === "GET" && apiPath.startsWith("/auth/onboarding-availability")) {
    return json({ email_available: true, slug_available: true, transaction_available: true });
  }

  if (method === "POST" && apiPath === "/auth/register-business") {
    return json({
      business: { id: "new-" + Date.now(), slug: "new-business" },
      tokens: mockTokenPair,
    });
  }

  // ─── Businesses (list / get / update / delete) ───────────────────────────
  if (method === "GET" && apiPath === "/businesses") {
    return json(mockBusinesses);
  }

  const businessMatch = apiPath.match(/^\/businesses\/([^\/]+)$/);
  if (businessMatch) {
    const businessId = businessMatch[1];

    if (method === "GET") {
      const business = mockBusinesses.find((b) => b.id === businessId) ?? mockBusinesses[0];
      return json(business);
    }

    if (method === "PUT") {
      const business = { ...mockBusinesses[0], id: businessId };
      return json(business);
    }

    if (method === "DELETE") {
      return noContent();
    }
  }

  // ─── Business Admin: Images ──────────────────────────────────────────────
  const imageMatch = apiPath.match(/^\/businesses\/([^\/]+)\/images\/([^\/]+)$/);
  if (imageMatch && method === "POST") {
    return json({ url: "https://example.com/uploaded-image.jpg" });
  }
  if (imageMatch && method === "DELETE") {
    return noContent();
  }

  // ─── Business Admin: Catalog Categories ──────────────────────────────────
  if (method === "GET" && apiPath.match(/^\/businesses\/([^\/]+)\/catalog\/categories$/)) {
    const catMatch = apiPath.match(/^\/businesses\/([^\/]+)\/catalog\/categories$/);
    if (catMatch) {
      const categories = mockBusinessCategories[catMatch[1]] ?? [];
      return json(categories);
    }
  }

  const categoryMatch = apiPath.match(/^\/businesses\/([^\/]+)\/catalog\/categories\/([^\/]+)$/);
  if (categoryMatch) {
    if (method === "POST") {
      return json({ id: "new-cat-" + Date.now(), name: "New Category", slug: "new-category", image_url: null, description: null, position: 1, is_visible: true });
    }
    if (method === "PUT") {
      return json({ id: categoryMatch[2], name: "Updated Category", slug: "updated-category", image_url: null, description: null, position: 1, is_visible: true });
    }
    if (method === "DELETE") {
      return noContent();
    }
  }

  // ─── Business Admin: Products ────────────────────────────────────────────
  if (method === "GET" && apiPath.match(/^\/businesses\/([^\/]+)\/catalog\/products$/)) {
    const prodMatch = apiPath.match(/^\/businesses\/([^\/]+)\/catalog\/products$/);
    if (prodMatch) {
      const products = mockProducts[prodMatch[1]] ?? [];
      return json(products);
    }
  }

  const productMatch = apiPath.match(/^\/businesses\/([^\/]+)\/catalog\/products\/([^\/]+)$/);
  if (productMatch) {
    if (method === "POST") {
      return json({ id: "new-prod-" + Date.now(), category_id: null, platform_category_id: null, name: "New Product", slug: "new-product", description: null, price: "100.00", currency: "CUP", image_url: null, is_available: true, is_published: true, track_inventory: false, stock_quantity: null });
    }
    if (method === "PUT") {
      return json({ id: productMatch[2], category_id: null, platform_category_id: null, name: "Updated Product", slug: "updated-product", description: null, price: "100.00", currency: "CUP", image_url: null, is_available: true, is_published: true, track_inventory: false, stock_quantity: null });
    }
    if (method === "DELETE") {
      return noContent();
    }
  }

  // ─── Business Admin: Services ────────────────────────────────────────────
  if (method === "GET" && apiPath.match(/^\/businesses\/([^\/]+)\/services$/)) {
    const svcMatch = apiPath.match(/^\/businesses\/([^\/]+)\/services$/);
    if (svcMatch) {
      const services = mockServices[svcMatch[1]] ?? [];
      return json(services);
    }
  }

  const serviceMatch = apiPath.match(/^\/businesses\/([^\/]+)\/services\/([^\/]+)$/);
  if (serviceMatch) {
    if (method === "POST") {
      return json({ id: "new-svc-" + Date.now(), category_id: null, platform_category_id: null, name: "New Service", slug: "new-service", description: null, price: "200.00", currency: "CUP", duration_minutes: 60, image_url: null, is_available: true, is_published: true });
    }
    if (method === "PUT") {
      return json({ id: serviceMatch[2], category_id: null, platform_category_id: null, name: "Updated Service", slug: "updated-service", description: null, price: "200.00", currency: "CUP", duration_minutes: 60, image_url: null, is_available: true, is_published: true });
    }
    if (method === "DELETE") {
      return noContent();
    }
  }

  // ─── Business Admin: Members ─────────────────────────────────────────────
  if (method === "GET" && apiPath.match(/^\/businesses\/([^\/]+)\/members$/)) {
    const memMatch = apiPath.match(/^\/businesses\/([^\/]+)\/members$/);
    if (memMatch) {
      const members = mockMembers[memMatch[1]] ?? [];
      return json(members);
    }
  }

  const memberMatch = apiPath.match(/^\/businesses\/([^\/]+)\/members\/([^\/]+)$/);
  if (memberMatch) {
    if (method === "POST") {
      return json({ id: "new-member-" + Date.now(), user_id: "new-" + Date.now(), email: "new@test.com", full_name: "New Member", role: "viewer" });
    }
    if (method === "PATCH") {
      return noContent();
    }
    if (method === "DELETE") {
      return noContent();
    }
  }

  // ─── Business Admin: Orders ──────────────────────────────────────────────
  if (method === "GET" && apiPath.match(/^\/businesses\/([^\/]+)\/orders$/)) {
    const ordMatch = apiPath.match(/^\/businesses\/([^\/]+)\/orders$/);
    if (ordMatch) {
      const orders = mockOrders[ordMatch[1]] ?? [];
      return json(orders);
    }
  }

  const orderStatusMatch = apiPath.match(/^\/businesses\/([^\/]+)\/orders\/([^\/]+)\/status$/);
  if (orderStatusMatch && method === "PATCH") {
    return noContent();
  }

  // ─── Business Admin: Subscription Payments ───────────────────────────────
  if (method === "GET" && apiPath.match(/^\/businesses\/([^\/]+)\/subscription-payments/)) {
    const payMatch = apiPath.match(/^\/businesses\/([^\/]+)\/subscription-payments/);
    if (payMatch) {
      const payments = mockPayments[payMatch[1]] ?? [];
      return json(payments);
    }
  }

  // ─── Business Admin: Analytics ───────────────────────────────────────────
  if (method === "GET" && apiPath.match(/^\/businesses\/([^\/]+)\/analytics$/)) {
    return json(mockAnalytics);
  }

  // ─── Platform Categories (public) ────────────────────────────────────────
  if (method === "GET" && apiPath === "/platform/categories") {
    return json(mockPlatformCategories);
  }

  // ─── Platform Admin: Categories ──────────────────────────────────────────
  if (method === "GET" && apiPath === "/platform/admin/categories") {
    return json(mockPlatformCategories);
  }

  if (method === "POST" && apiPath === "/platform/admin/categories") {
    return json({ id: "new-pc-" + Date.now(), name: "New Platform Category", slug: "new-platform-category", description: null, is_active: true });
  }

  const platformCategoryMatch = apiPath.match(/^\/platform\/admin\/categories\/([^\/]+)$/);
  if (platformCategoryMatch) {
    if (method === "PUT") {
      return json({ id: platformCategoryMatch[1], name: "Updated Platform Category", slug: "updated-platform-category", description: null, is_active: true });
    }
    if (method === "DELETE") {
      return noContent();
    }
  }

  // ─── Platform Admin: Subscription Payments ───────────────────────────────
  if (method === "GET" && /^\/platform\/admin\/subscription-payments(\?.*)?$/.test(apiPath)) {
    return json(Object.values(mockPayments).flat());
  }

  if (method === "POST" && apiPath === "/platform/admin/subscription-payments") {
    return json({ id: "new-payment-" + Date.now(), business_id: "1", transaction_number: "TXN-NEW", plan: "basic", phone_number: "+53 5555-0000", execution_date: "2024-06-01", expiration_date: "2024-06-30", amount_paid: "1500.00", created_at: now });
  }

  const paymentMatch = apiPath.match(/^\/platform\/admin\/subscription-payments\/([^\/]+)$/);
  if (paymentMatch) {
    if (method === "PUT") {
      return json({ id: paymentMatch[1], business_id: "1", transaction_number: "TXN-UPD", plan: "basic", phone_number: "+53 5555-0000", execution_date: "2024-06-01", expiration_date: "2024-06-30", amount_paid: "1500.00", created_at: now });
    }
    if (method === "DELETE") {
      return noContent();
    }
  }

  // ─── Platform Admin: Exchange Rates ──────────────────────────────────────
  if (method === "GET" && apiPath === "/platform/exchange-rates") {
    return json(mockExchangeRates);
  }

  if (method === "POST" && apiPath === "/platform/admin/exchange-rates") {
    return json({ id: "new-rate-" + Date.now(), currency: "CAD", value_in_cup: "90.00" });
  }

  const rateMatch = apiPath.match(/^\/platform\/admin\/exchange-rates\/([^\/]+)$/);
  if (rateMatch) {
    if (method === "PUT") {
      return json({ id: rateMatch[1], currency: "CAD", value_in_cup: "95.00" });
    }
    if (method === "DELETE") {
      return noContent();
    }
  }

  // ─── Payment Settings ────────────────────────────────────────────────────
  if (method === "GET" && apiPath === "/platform/payment-settings") {
    return json(mockPaymentSettings);
  }

  if (method === "PUT" && apiPath === "/platform/admin/payment-settings") {
    return json(mockPaymentSettings);
  }

  // ─── Public Business ─────────────────────────────────────────────────────
  const publicBusinessMatch = apiPath.match(/^\/public\/businesses\/([^\/]+)$/);
  if (publicBusinessMatch && method === "GET") {
    return json(mockBusinesses[0]);
  }

  if (method === "GET" && apiPath.match(/^\/public\/businesses\/([^\/]+)\/catalog$/)) {
    return json(mockPublicCatalog);
  }

  if (method === "GET" && apiPath.match(/^\/public\/businesses\/([^\/]+)\/services$/)) {
    return json([]);
  }

  if (method === "POST" && apiPath.match(/^\/public\/businesses\/([^\/]+)\/orders$/)) {
    return json({ id: "new-order-" + Date.now(), order_number: "ORD-NEW", status: "pending", currency: "CUP", subtotal: "350.00", total: "350.00" });
  }

  // ─── Platform Public: Discovery ──────────────────────────────────────────
  if (method === "GET" && apiPath.startsWith("/public/businesses/discovery")) {
    return json(mockDiscovery);
  }

  // ─── Fallback ────────────────────────────────────────────────────────────
  return notFound();
};
