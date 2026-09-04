import type { Metadata } from "next";

export function seo(title: string, metadata?: Metadata) {
  return {
    title: `El Bisne | ${title
      .replace(/el bisne/i, "")
      .replace(/\|/i, "")
      .trim()}`,
    ...metadata,
    keywords: `negocios,bisne,elbisne,el bisne,habana,cuba,emprendimiento,orbita,tecnologias orbita,${metadata?.keywords || ""}`,
    description:
      metadata?.description ||
      `
		El Bisne es una plataforma online de gestión empresarial e ecommerce. Ofrece un entorno digital con herramientas para los 
		pequeños emprendedores y negocios iniciantes. La plataforma es desarrollada y mantenida por Tecnologías Órbita. Únete a la
		comunidad del Bisne y crece con nosotros.
		`,
    applicationName: "El Bisne",
    authors: [
      {
        name: "Tecnologías Órbita",
        url: "www.tecnologiasorbita.qd.je",
      },
    ],
  } as Metadata;
}
