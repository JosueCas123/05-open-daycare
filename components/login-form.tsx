"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email o contraseña incorrectos");
      setSubmitting(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-2 text-[12px] font-bold tracking-[.7px] text-login-label">
        EMAIL
      </div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={submitting}
        className="mb-[18px] w-full rounded-[14px] border-[1.5px] border-login-input-border bg-login-input-bg px-4 py-[14px] text-[15px] text-ink outline-none"
      />

      <div className="mb-2 text-[12px] font-bold tracking-[.7px] text-login-label">
        CONTRASEÑA
      </div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={submitting}
        placeholder="••••••••"
        className="mb-[10px] w-full rounded-[14px] border-[1.5px] border-login-input-border bg-login-input-bg px-4 py-[14px] text-[15px] text-ink outline-none placeholder:text-login-placeholder"
      />

      {error && (
        <div className="mb-[10px] -mt-[2px] text-[13.5px] font-bold text-coral-dark">
          {error}
        </div>
      )}

      <div className="mb-5 mt-0 text-right">
        <a
          href="#"
          className="cursor-pointer text-[13.5px] font-bold text-coral-dark"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="block w-full rounded-[15px] bg-gradient-to-b from-coral-gradient to-coral-deep px-4 py-[15px] text-center text-base font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,.7)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Ingresando…" : "Iniciar sesión"}
      </button>
    </form>
  );
}