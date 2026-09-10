import { APP_ROUTER } from "@/lib/route/app-router";
import ReducedLogo from "@/shared/components/ReducedLogo";
import { PrimaryButton, SecondaryButton } from "@/shared/ui";
import { LogInIcon, SearchIcon, StoreIcon } from "lucide-react";
import SetVisitedCookie from "../components/SetVisitedCookie";

export default function WelcomePage() {
  return (
    <div className="relative grid place-items-center p-4 min-h-screen overflow-x-hidden">
      <picture className="absolute top-0 left-0 size-full -z-10 bg-linear-to-br from-green-700 via-green-600 via-70% to-lime-500 blur-xs rounded-br-[80%]" />
      <picture className="absolute top-0 left-0 size-full -z-20 bg-green-600 blur-2xl rounded-br-[80%]" />
      <picture className="absolute top-0 left-0 size-full -z-30 bg-green-700/80 blur-2xl rounded-br-[100%_232%]" />
      <picture className="absolute top-0 left-0 size-full -z-40 bg-green-600" />
      <SetVisitedCookie />
      <section className="relative z-50 grid gap-4 justify-items-center border border-white/25 bg-cream-100 shadow-2xl w-11/12 max-w-lg rounded-2xl p-8 text-center">
        <ReducedLogo className="w-12 aspect-square" />
        <h2 className="text-green-600 max-lg:text-4xl leading-none">
          Bienvenido a <br />
          <span className="text-green-500">El Bisne</span>
        </h2>
        <p className="text-gray-500">
          Descubre negocios cubanos, administra el tuyo y empieza a construir su
          presencia digital.
        </p>
        <div className="grid w-full gap-4">
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
