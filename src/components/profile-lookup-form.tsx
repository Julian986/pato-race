"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PROFILE_KEY = "pato-race-profile-id";

export function rememberProfileId(id: string) {
  try {
    localStorage.setItem(PROFILE_KEY, id);
  } catch {
    /* ignore */
  }
}

export function readRememberedProfileId(): string | null {
  try {
    return localStorage.getItem(PROFILE_KEY);
  } catch {
    return null;
  }
}

export function ProfileLookupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const ticketCode = String(form.get("ticketCode") ?? "");
    const email = String(form.get("email") ?? "");

    try {
      const res = await fetch("/api/perfil/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketCode, email }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        profileId?: string;
        error?: string;
      };

      if (!res.ok || !data.profileId) {
        setError(data.error ?? "No se pudo abrir el perfil");
        setLoading(false);
        return;
      }

      rememberProfileId(data.profileId);
      router.push(`/perfil/${data.profileId}`);
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-xs font-black uppercase tracking-[0.18em] text-ink-muted">
          Número de ticket
        </span>
        <input
          name="ticketCode"
          required
          placeholder="PR-123456"
          autoComplete="off"
          className="w-full rounded-2xl border border-line bg-bg/60 px-4 py-3.5 font-[family-name:var(--font-display)] text-2xl tracking-wide text-duck outline-none transition placeholder:text-ink-muted/40 focus:border-duck"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-xs font-black uppercase tracking-[0.18em] text-ink-muted">
          Email del registro
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="tu@email.com"
          className="w-full rounded-2xl border border-line bg-bg/60 px-4 py-3.5 text-ink outline-none transition placeholder:text-ink-muted/40 focus:border-duck"
        />
      </label>

      {error ? (
        <p className="rounded-2xl border border-coral/40 bg-coral/10 px-4 py-3 text-sm text-foam">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="fun-button w-full rounded-full bg-duck px-6 py-3.5 text-base font-black text-bg disabled:opacity-60"
      >
        {loading ? "Buscando…" : "Entrar a mi perfil"}
      </button>
    </form>
  );
}

export function RememberedProfileLink() {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    setId(readRememberedProfileId());
  }, []);

  if (!id) return null;

  return (
    <Link
      href={`/perfil/${id}`}
      className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-water/40 bg-water/10 px-5 py-3 text-sm font-semibold text-water-bright transition hover:border-water-bright"
    >
      Continuar con el perfil guardado
    </Link>
  );
}

/** Guarda el id al visitar el perfil (post-pago / deep link). */
export function ProfileRemember({ id }: { id: string }) {
  useEffect(() => {
    rememberProfileId(id);
  }, [id]);
  return null;
}
