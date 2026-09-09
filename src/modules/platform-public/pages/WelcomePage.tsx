import { APP_ROUTER } from "@/lib/route/app-router";
import ReducedLogo from "@/shared/components/ReducedLogo";
import { PrimaryButton, SecondaryButton } from "@/shared/ui";
import { LogInIcon, SearchIcon, StoreIcon } from "lucide-react";
import SetVisitedCookie from "../components/SetVisitedCookie";

export default function WelcomePage() {
  return (
    <div
      aria-labelledby="entry-title"
      aria-modal="true"
      className="fixed inset-0 z-10000 grid place-items-center p-6 bg-[radial-gradient(circle_at_15%_20%,rgba(198,238,71,0.18),transparent_34%),linear-gradient(145deg,#073f35,#0c5a48_54%,#08352f)] sm:p-[14px]"
      role="dialog"
    >
      <SetVisitedCookie />
      <section className="grid gap-4 w-[min(620px,100%)] px-[clamp(30px,6vw,58px)] py-[clamp(30px,6vw,58px)] border border-white/20 rounded-[32px] bg-white/96 text-center shadow-[0_32px_90px_rgba(0,24,19,0.35)] sm:px-[22px] sm:py-[30px] sm:rounded-[24px]">
        <ReducedLogo className="size-16 mx-auto" />
        <h1
          id="entry-title"
          className="text-green-dark text-[clamp(2rem,6vw,3.5rem)] leading-none"
        >
          Bienvenido a <br />
          El Bisne
        </h1>
        <p className="max-w-120 mx-auto text-gray-600 leading-[1.65]">
          Descubre negocios cubanos, administra el tuyo o empieza a construir su
          presencia digital.
        </p>
        <div className="grid gap-4">
          <PrimaryButton
            link
            href={APP_ROUTER.LOGIN}
            className="flex justify-between px-5 py-4 rounded-2xl"
          >
            Iniciar sesión <LogInIcon className="size-4" />
          </PrimaryButton>
          <SecondaryButton
            link
            href={APP_ROUTER.BISNE_NEW}
            className="flex justify-between px-5 py-4 rounded-2xl"
          >
            Crear tu negocio <StoreIcon className="size-4" />
          </SecondaryButton>
          <SecondaryButton
            link
            href={APP_ROUTER.HOME}
            className="flex justify-between px-5 py-4 rounded-2xl"
          >
            Continuar comprando <SearchIcon className="size-4" />
          </SecondaryButton>
        </div>
      </section>
    </div>
  );
}
