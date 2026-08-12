"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  clearSession,
  readSession,
  type UserSession,
} from "@/components/profile-access";
import { campaign, formatARS } from "@/lib/campaign";

export function AccountDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = readSession();
    setSession(s);
    setReady(true);
    if (!s) router.replace("/perfil");
  }, [router]);

  function logout() {
    clearSession();
    router.push("/perfil");
  }

  if (!ready || !session) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center text-ink-muted">
        Cargando tu cuenta…
      </div>
    );
  }

  const duckCount = session.duckIds.length;
  const firstName = session.name.trim().split(/\s+/)[0] || "hola";

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:px-8 md:py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-water-bright">
            Tu cuenta
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-5xl tracking-wide text-ink md:text-6xl">
            HOLA,{" "}
            <span className="text-duck">{firstName.toUpperCase()}</span>
          </h1>
          <p className="mt-2 text-sm text-ink-muted">{session.email}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-line px-4 py-2 text-sm text-ink-muted transition hover:border-ink/40 hover:text-ink"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-line bg-bg-elevated/90 p-6 shadow-[var(--shadow)] md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-ink-muted">
            Mis patos
          </p>
          <p className="mt-3 font-[family-name:var(--font-display)] text-7xl leading-none tracking-wide text-duck">
            {duckCount}
          </p>
          <p className="mt-2 text-base text-ink-muted">
            {duckCount === 0
              ? "Todavía no tenés patos adoptados."
              : duckCount === 1
                ? "Tenés 1 pato en carrera."
                : `Tenés ${duckCount} patos en carrera.`}
          </p>

          {duckCount === 0 ? (
            <div className="mt-8 space-y-4">
              <div className="relative mx-auto aspect-square w-40 opacity-40 grayscale">
                <Image
                  src="/pato_corre.webp"
                  alt=""
                  fill
                  sizes="160px"
                  className="object-contain"
                />
              </div>
              <p className="rounded-2xl border border-dashed border-line bg-bg/40 px-4 py-3 text-sm text-ink-muted">
                Cuando Mercado Pago nos avise que el pago está aprobado, tu
                ticket y tu pato aparecen acá automáticamente.
              </p>
              <Link
                href="/participar"
                className="fun-button inline-flex w-full items-center justify-center rounded-full bg-duck px-6 py-3.5 text-base font-black text-bg"
              >
                Adoptá tu pato · {formatARS(campaign.ticketPrice)}
              </Link>
            </div>
          ) : (
            <ul className="mt-8 space-y-3">
              {session.duckIds.map((id, i) => (
                <li key={id}>
                  <Link
                    href={`/perfil/${id}`}
                    className="flex items-center justify-between rounded-2xl border border-line bg-bg/50 px-4 py-3 transition hover:border-duck/50"
                  >
                    <span className="font-semibold text-ink">
                      Pato #{i + 1}
                    </span>
                    <span className="text-sm text-water-bright">Ver ticket →</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/participar"
                  className="inline-flex w-full items-center justify-center rounded-full border border-duck/40 px-5 py-3 text-sm font-semibold text-duck transition hover:bg-duck/10"
                >
                  Adoptar otro pato
                </Link>
              </li>
            </ul>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-[2rem] border border-water/30 bg-water/10 p-6">
            <p className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-ink">
              Cómo funciona
            </p>
            <ol className="mt-4 space-y-3 text-sm text-ink-muted">
              <li>1. Adoptás tu pato desde la app.</li>
              <li>2. Pagás con Mercado Pago.</li>
              <li>
                3. El webhook confirma el pago y te asignamos ticket + pato en
                esta cuenta.
              </li>
              <li>4. Compartís tu participación y seguís la carrera.</li>
            </ol>
          </div>
          <div className="rounded-[2rem] border border-line bg-bg-elevated/80 p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-ink-muted">
              Evento
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-wide">
              {campaign.location}
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              {campaign.eventDateLabel} · {campaign.eventTimeLabel}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
