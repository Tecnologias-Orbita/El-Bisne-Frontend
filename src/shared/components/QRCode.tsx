"use client";

import { env } from "@/config/env";
import { Download } from "lucide-react";
import QR from "qrcode";
import { useEffect, useRef, useState } from "react";
import { SecondaryButton } from "../ui";

interface Props {
  href: string;
  size?: number;
  name?: string;
}

export default function QRCode({ href, size, name }: Props) {
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    let url: URL | string;

    if (URL.canParse(href)) {
      url = new URL(href);
    } else {
      url = env.appUrl ? new URL(env.appUrl + href) : new URL(href);
    }

    QR.toCanvas(canvasRef.current, url.toString(), {
      width: size || 256,
    }).catch(() => {
      setError("No se pudo generar el código QR");
    });
  }, [href, size]);

  const onDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${name || ""}-qrcode.png`;
    link.href = url;
    link.click();
  };

  return (
    <div className="grid gap-2 justify-items-center">
      <picture className="rounded-2xl p-2 shadow-lg flex w-max">
        {error ? (
          <span className="text-sm text-red-200">{error}</span>
        ) : (
          <canvas ref={canvasRef} className={`size-[${size || 256}px]`}>
            <span className="text-sm text-red-200">Qr no disponible</span>
          </canvas>
        )}
      </picture>
      <SecondaryButton className="w-max text-xs" onClick={onDownload}>
        <Download size={16} /> Descargar imagen
      </SecondaryButton>
    </div>
  );
}
