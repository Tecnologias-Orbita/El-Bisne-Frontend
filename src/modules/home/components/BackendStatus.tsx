"use client";

import { useBackendHealth } from "../hooks/useBackendHealth";
import type { BackendStatus as BackendStatusValue } from "../types/home.types";

const statusText: Record<BackendStatusValue, string> = {
  loading: "Comprobando backend…",
  online: "Backend conectado",
  offline: "Backend no disponible",
};

export function BackendStatus() {
  const { status, retry } = useBackendHealth();

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
      <span
        className={
          status === "online"
            ? "text-emerald-400"
            : status === "offline"
              ? "text-rose-400"
              : "text-slate-400"
        }
      >
        {statusText[status]}
      </span>

      {status === "offline" && (
        <button
          className="rounded-md border border-slate-700 px-3 py-1.5 hover:bg-slate-800"
          onClick={() => void retry()}
          type="button"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
