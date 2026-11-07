import { PrimaryButton } from "@/shared/ui";
import { ArrowDownIcon } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative z-10 px-4 py-8 bg-green-400 shadow-lg border-b border-lime-300/75">
      <picture
        data-name="background"
        className="-z-10 absolute top-0 left-0 w-full h-[90%] bg-linear-to-br from-green-700 to-green-600 rounded-b-[120px] blur-xl contrast-110 origin-bottom scale-125"
      />
      <picture
        data-name="mobile_lime_lines"
        className="-z-10 absolute top-1/2 right-0 -translate-y-1/2 translate-x-16 flex gap-8 items-center opacity-75 md:hidden"
      >
        <figure className="w-12 h-64 bg-linear-to-b from-lime-300 from-60% to-transparent skew-y-[-45deg] rotate-45" />
        <figure className="w-8 h-64 bg-linear-to-b from-lime-300 from-60% to-transparent skew-y-[-45deg] rotate-45" />
      </picture>
      <div className="grid gap-4 max-w-5xl mx-auto relative z-10">
        <picture
          data-name="blurred_point"
          className="absolute top-0 left-0 -translate-1/2 size-32 rounded-full blur-2xl opacity-25 bg-lime-300 -z-10"
        />
        <h1 className="leading-none font-black text-white max-w-2xl">
          Descubre lo que <span className="text-lime-300">Cuba</span> está
          creando
        </h1>
        <p className="text-white">
          Negocios locales, productos únicos y servicios profesionales.
        </p>
        <PrimaryButton
          link
          href="/#explore"
          className="w-max text-green-600 bg-lime-300 hover:bg-lime-300 font-bold rounded-2xl"
        >
          Comienza a explorar{" "}
          <ArrowDownIcon className="size-4" strokeWidth={3} />
        </PrimaryButton>
      </div>
    </section>
  );
}
