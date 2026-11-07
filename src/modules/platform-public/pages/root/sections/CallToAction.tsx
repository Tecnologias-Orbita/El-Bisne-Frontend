import { PrimaryButton } from "@/shared/ui";
import { ArrowRightIcon } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="bg-green-700 px-4 py-12 md:py-16">
      <div className="mx-auto grid max-w-5xl items-center gap-6 md:flex md:justify-between md:gap-10">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-lime-300">
            ¿Tienes un negocio?
          </p>
          <h2 className="text-3xl font-black leading-tight text-white md:text-5xl">
            Haz que más personas encuentren tu bisne.
          </h2>
        </div>
        <PrimaryButton
          link
          href="/login"
          className="w-max shrink-0 rounded-2xl bg-lime-300 font-bold text-green-700 hover:bg-lime-300"
        >
          Entrar a la administración
          <ArrowRightIcon className="size-4" strokeWidth={3} />
        </PrimaryButton>
      </div>
    </section>
  );
}
