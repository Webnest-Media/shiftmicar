"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api, setToken } from "@/lib/api";
import { adminBtnPrimary, adminInputClass } from "@/components/admin/admin-ui";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await api.login(email, password);
      setToken(result.token);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cms-login">
      <div className="cms-login-card">
        <div className="cms-brand-mark" style={{ width: "2.5rem", height: "2.5rem" }}>
          SM
        </div>
        <h1>Content Studio</h1>
        <p>Sign in to manage blogs, media, and publishing.</p>
        <form className="cms-login-form" onSubmit={onSubmit}>
          <label className="cms-field">
            <span>Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              className={adminInputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="cms-field">
            <span>Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              className={adminInputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error ? (
            <p className="cms-error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" disabled={loading} className={adminBtnPrimary}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
