import { Link } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="">
      <p className="eyebrow">¿Tienes un negocio?</p>
      <h2>Haz que más personas encuentren tu bisne.</h2>
      <Link href="/login">Entrar a la administración</Link>
    </section>
  );
}
