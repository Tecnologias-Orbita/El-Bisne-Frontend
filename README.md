# El Bisne — Frontend

Frontend creado con Next.js, TypeScript, App Router, Tailwind CSS y ESLint.

## Requisitos

- Node.js 20.9 o superior
- npm 10 o superior

## Instalación y arranque

La aplicación depende de dependencias internas de Github Packages para lo cual hay que configurar un token de acceso personal (classic).

```bash
cd El-Bisne-Frontend
GITHUB_TOKEN=<token> npm install
cp .env.example .env.local
npm run dev
```

Abre <http://localhost:3000>.

La ruta inicial es el login de administración global. Con el seed del backend
puedes entrar usando:

```text
admin@elbisne.dev
Admin123!
```

Tras validar el token y el atributo `is_platform_admin`, el frontend redirige a
`/admin`. El panel consume las APIs reales y permite:

- Consultar, crear, editar y archivar negocios. El alta crea también la cuenta
  y contraseña inicial del owner, su pago y su membresía.
- Consultar, registrar, editar y eliminar pagos de suscripción.
- Consultar y administrar las tasas de cambio referenciadas a CUP.
- Actualizar la tarjeta bancaria y el teléfono público de confirmación.
- Consultar un resumen calculado a partir de negocios y pagos reales.

## Comandos disponibles

```bash
npm run dev      # servidor de desarrollo
npm run lint     # análisis estático
npm run build    # compilación de producción
npm run start    # sirve la compilación de producción
```

La URL pública del backend se configura en `.env.local` mediante
`NEXT_PUBLIC_API_URL`.

## Arquitectura

```text
src/
├── app/                    # Rutas de Next.js; deben ser delgadas
├── config/                 # Variables y configuración de la aplicación
├── lib/
│   └── api/                # Cliente HTTP compartido
├── modules/
│   ├── auth/               # Login, sesión y validación de platform admin
│   ├── platform-admin/     # Ruta protegida y panel global
│   └── home/
│       ├── components/     # UI propia del módulo
│       ├── hooks/          # Estado y lógica de interacción
│       ├── pages/          # Composición de la pantalla
│       ├── services/       # Acceso al backend
│       └── types/          # Tipos del dominio
└── shared/
    └── components/         # Componentes reutilizables entre módulos
```

Cada funcionalidad nueva debe ser un módulo independiente. Por ejemplo,
`modules/products` puede contener `ProductCard`, `useProducts`,
`products.service.ts`, `ProductsPage` y sus tipos. Los archivos de `app/`
solo conectan una ruta de Next.js con la página del módulo.
