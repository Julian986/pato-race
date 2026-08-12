"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SESSION_KEY = "pato-race-user-session";
const PROFILE_KEY = "pato-race-profile-id";

export type UserSession = {
  email: string;
  name: string;
  /** IDs de participación / tickets vinculados (vacío hasta pago confirmado). */
  duckIds: string[];
  createdAt: string;
};

export function readSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

export function writeSession(session: UserSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

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

export function ProfileRemember({ id }: { id: string }) {
  useEffect(() => {
    rememberProfileId(id);
    const session = readSession();
    if (session && !session.duckIds.includes(id)) {
      writeSession({ ...session, duckIds: [...session.duckIds, id] });
    }
  }, [id]);
  return null;
}

type Mode = "login" | "ticket";

/** Acceso: login (principal) o ticket + email (alternativa). Sin backend real aún. */
export function ProfileAccessPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rememberedId, setRememberedId] = useState<string | null>(null);

  useEffect(() => {
    setRememberedId(readRememberedProfileId());
    const session = readSession();
    if (session) {
      router.replace("/perfil/cuenta");
    }
  }, [router]);

  async function onLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const name = String(form.get("name") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!email || password.length < 4) {
      setError("Completá email y una contraseña de al menos 4 caracteres.");
      setLoading(false);
      return;
    }

    // Mock local: aún no hay auth real / backend.
    await new Promise((r) => setTimeout(r, 450));
    writeSession({
      email,
      name: name || email.split("@")[0] || "Participante",
      duckIds: [],
      createdAt: new Date().toISOString(),
    });
    router.push("/perfil/cuenta");
  }

  async function onTicketLookup(e: React.FormEvent<HTMLFormElement>) {
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
      const session = readSession();
      if (session && !session.duckIds.includes(data.profileId)) {
        writeSession({
          ...session,
          duckIds: [...session.duckIds, data.profileId],
        });
      }
      router.push(`/perfil/${data.profileId}`);
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-1 rounded-full border border-line bg-bg/50 p-1">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError(null);
          }}
          className={`rounded-full px-3 py-2.5 text-sm font-semibold transition ${
            mode === "login"
              ? "bg-duck text-bg"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          Iniciar sesión
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("ticket");
            setError(null);
          }}
          className={`rounded-full px-3 py-2.5 text-sm font-semibold transition ${
            mode === "ticket"
              ? "bg-duck text-bg"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          Tengo un ticket
        </button>
      </div>

      {mode === "login" ? (
        <form onSubmit={onLogin} className="mt-6 space-y-4">
          <p className="text-sm text-ink-muted">
            Entrá con tu cuenta. Si todavía no adoptaste, vas a ver{" "}
            <span className="font-semibold text-ink">0 patos</span> y el botón
            para adoptar. Cuando Mercado Pago confirme el pago, el pato y el
            ticket aparecen acá.
          </p>
          <Field
            label="Nombre"
            name="name"
            autoComplete="name"
            placeholder="Tu nombre"
          />
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            required
          />
          <Field
            label="Contraseña"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
          <p className="text-[11px] text-ink-muted">
            Demo UI: el login se guarda en este dispositivo. El backend de
            autenticación llega después.
          </p>
          {error ? <ErrorBox>{error}</ErrorBox> : null}
          <button
            type="submit"
            disabled={loading}
            className="fun-button w-full rounded-full bg-duck px-6 py-3.5 text-base font-black text-bg disabled:opacity-60"
          >
            {loading ? "Entrando…" : "Entrar a mi cuenta"}
          </button>
        </form>
      ) : (
        <form onSubmit={onTicketLookup} className="mt-6 space-y-4">
          <p className="text-sm text-ink-muted">
            Si ya adoptaste y tenés el número, abrí el comprobante directo.
          </p>
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
          <Field
            label="Email del registro"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            required
          />
          {error ? <ErrorBox>{error}</ErrorBox> : null}
          <button
            type="submit"
            disabled={loading}
            className="fun-button w-full rounded-full bg-duck px-6 py-3.5 text-base font-black text-bg disabled:opacity-60"
          >
            {loading ? "Buscando…" : "Ver mi ticket"}
          </button>
        </form>
      )}

      {rememberedId ? (
        <Link
          href={`/perfil/${rememberedId}`}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-water/40 bg-water/10 px-5 py-3 text-sm font-semibold text-water-bright transition hover:border-water-bright"
        >
          Continuar con el ticket guardado
        </Link>
      ) : null}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-ink-muted">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-line bg-bg/60 px-4 py-3.5 text-ink outline-none transition placeholder:text-ink-muted/40 focus:border-duck"
      />
    </label>
  );
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl border border-coral/40 bg-coral/10 px-4 py-3 text-sm text-foam">
      {children}
    </p>
  );
}
