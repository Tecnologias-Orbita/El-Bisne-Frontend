import { Container } from "@/shared/components/Container";
import { BackendStatus } from "./BackendStatus";

export function Hero() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 text-white">
      <Container className="space-y-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Next.js + arquitectura modular
        </p>
        <h1 className="text-5xl font-bold tracking-tight">El Bisne</h1>
        <p className="text-slate-300">
          Páginas, componentes, hooks y servicios separados.
        </p>
        <BackendStatus />
      </Container>
    </main>
  );
}
