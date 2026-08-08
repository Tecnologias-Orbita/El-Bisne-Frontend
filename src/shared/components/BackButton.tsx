"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  return <button className="login-back" onClick={() => router.back()} type="button">← Volver</button>;
}
