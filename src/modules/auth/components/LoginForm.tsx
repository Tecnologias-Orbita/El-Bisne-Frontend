"use client";

import { useLogin } from "../hooks/useLogin";

export function LoginForm() {
  const login = useLogin();

  return (
    <form className="login-form" onSubmit={login.handleSubmit}>
      <div className="field-group">
        <label htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="admin@elbisne.dev"
          value={login.email}
          onChange={(event) => login.setEmail(event.target.value)}
          required
        />
      </div>

      <div className="field-group">
        <div className="field-label-row">
          <label htmlFor="password">Contraseña</label>
          <span>Acceso seguro</span>
        </div>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={login.password}
          onChange={(event) => login.setPassword(event.target.value)}
          required
        />
      </div>

      {login.error ? <p className="form-error">{login.error}</p> : null}

      <button className="primary-button" type="submit" disabled={login.isSubmitting}>
        {login.isSubmitting ? "Verificando…" : "Entrar al panel"}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
