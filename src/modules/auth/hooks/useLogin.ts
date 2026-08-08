"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { authService } from "../services/auth.service";
import { sessionService } from "../services/session.service";

export function useLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function destinationAfterLogin() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("intent") === "create-business") return "/admin";
    const requested = params.get("next");
    return requested?.startsWith("/") && !requested.startsWith("//") ? requested : "/admin";
  }

  useEffect(() => {
    const session = sessionService.get();
    if (!session) return;
    void authService
      .getCurrentUser(session.access_token)
      .then((user) => {
        if (user.is_platform_admin) router.replace(destinationAfterLogin());
      })
      .catch(() => sessionService.clear());
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await authService.createPlatformSession({ email, password });
      router.push(destinationAfterLogin());
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
