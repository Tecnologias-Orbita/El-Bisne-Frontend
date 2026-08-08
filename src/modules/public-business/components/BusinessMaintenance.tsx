import Link from "next/link";

export function BusinessMaintenance({ name }: { name: string }) {
  return <main className="business-maintenance"><Link href="/">El Bisne</Link><section><span>Estamos preparando algo especial</span><h1>{name}</h1><p>Este negocio está organizando su espacio digital. Muy pronto podrás conocer todo lo que tiene para ofrecerte.</p><div>En mantenimiento</div></section><Link href="/">Descubrir otros negocios →</Link></main>;
}
