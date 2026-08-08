"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import { authService } from "../services/auth.service";
import { sessionService } from "../services/session.service";

function destinationAfterLogin() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("intent") === "create-business") return "/admin";
  const requested = params.get("next");
  return requested?.startsWith("/") && !requested.startsWith("//") ? requested : "/admin";
}

export function useLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectAuthenticatedUser = useCallback(async (user: { is_platform_admin: boolean }) => {
    if (user.is_platform_admin) { router.replace(destinationAfterLogin()); return; }
    const businesses = await authService.listManagedBusinesses();
    if (!businesses.length) throw new Error("Esta cuenta no tiene un negocio asignado.");
    router.replace(`/admin/businesses/${businesses[0].id}`);
  }, [router]);

  useEffect(() => {
    const session = sessionService.get();
    if (!session) return;
    void authService
      .getCurrentUser(session.access_token)
      .then(redirectAuthenticatedUser)
      .catch(() => sessionService.clear());
  }, [redirectAuthenticatedUser]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const user = await authService.createSession({ email, password });
      await redirectAuthenticatedUser(user);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No pudimos iniciar sesión. Inténtalo nuevamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    email,
    password,
    error,
    isSubmitting,
    setEmail,
    setPassword,
    handleSubmit,
  };
}
