"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { formatARS } from "@/lib/campaign";
import type { PublicStats } from "@/lib/db/store";

function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const from = prev.current;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      const next = Math.round(from + (target - from) * eased);
      setValue(next);
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        prev.current = target;
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

export function StatsDashboard({
  initial,
  compact = false,
}: {
  initial: PublicStats;
  compact?: boolean;
}) {
  const [stats, setStats] = useState(initial);
  const [bump, setBump] = useState(false);
  const raised = useCountUp(stats.raised);
  const participants = useCountUp(stats.participants);
  const progress = Math.min(100, stats.progress);
  const progressShown = useCountUp(Math.round(progress), 1600);
  const prevRaised = useRef(stats.raised);

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as PublicStats;
        if (data.raised !== prevRaised.current) {
          setBump(true);
          prevRaised.current = data.raised;
          window.setTimeout(() => setBump(false), 700);
        }
        setStats(data);
      } catch {
        /* ignore polling errors */
      }
    }, 8000);
    return () => clearInterval(id);
  }, []);

  if (compact) {
    const duckX = Math.max(6, Math.min(92, progress || 4));

    return (
      <div className="live-board relative overflow-hidden rounded-[1.75rem] border-[3px] border-duck bg-[#0a1f24] p-4 shadow-[8px_8px_0_#9a7400] sm:p-5">
        <div className="pointer-events-none absolute inset-0 live-board-grid opacity-40" />
        <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-duck/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-8 h-32 w-32 rounded-full bg-water/25 blur-2xl" />

        <div className="relative flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="live-pulse relative flex h-3 w-3">
              <span className="absolute inset-0 rounded-full bg-coral animate-ping opacity-70" />
              <span className="relative h-3 w-3 rounded-full bg-coral shadow-[0_0_12px_#ff5a45]" />
            </span>
            <div>
              <p className="font-[family-name:var(--font-display)] text-xl leading-none tracking-wide text-ink sm:text-2xl">
                EN VIVO
              </p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-water-bright">
                La carrera ya suma
              </p>
            </div>
          </div>
          <span className="-rotate-2 rounded-md bg-coral px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-[3px_3px_0_rgba(0,0,0,0.35)]">
            Meta {formatARS(stats.goal)}
          </span>
        </div>

        <div className={`relative mt-4 ${bump ? "live-bump" : ""}`}>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink-muted">
            Recaudado
          </p>
          <p className="live-amount mt-1 font-[family-name:var(--font-display)] text-[clamp(2.6rem,8vw,3.6rem)] leading-none tracking-wide text-duck">
            {formatARS(raised)}
          </p>
        </div>

        <div className="relative mt-5">
          <div className="relative h-9 overflow-hidden rounded-full border-2 border-water-bright/40 bg-[#06141a]">
            <div
              className="live-wave absolute inset-y-0 left-0 overflow-hidden transition-[width] duration-1000 ease-out"
              style={{ width: `${Math.max(progress, 3)}%` }}
            >
              <div className="live-wave-fill h-full w-[220%]" />
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-[left] duration-1000 ease-out"
              style={{ left: `calc(${duckX}% - 16px)` }}
              aria-hidden
            >
              <span className="live-duck relative block h-7 w-7 overflow-hidden rounded-full border-2 border-duck shadow-[0_2px_0_rgba(0,0,0,0.35)]">
                <Image
                  src="/pato_corre.webp"
                  alt=""
                  fill
                  sizes="28px"
                  className="object-cover object-center"
                />
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
            <span>Salida</span>
            <span className="text-duck">{progressShown}% a meta</span>
            <span>Meta</span>
          </div>
        </div>

        <div className="relative mt-4 grid grid-cols-[1.1fr_0.9fr] gap-3">
          <div className="rounded-2xl border-2 border-line bg-[#102830] px-3 py-3">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-water-bright">
              Patos adoptados
            </p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-4xl leading-none tracking-wide text-ink">
              {participants.toLocaleString("es-AR")}
            </p>
          </div>
          <div className="relative overflow-hidden rounded-2xl border-2 border-duck/50 bg-duck px-3 py-3 text-bg shadow-[4px_4px_0_#9a7400]">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-bg/70">
              Avance
            </p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-4xl leading-none tracking-wide">
              {progressShown}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-line bg-bg-elevated/80 p-6 shadow-[var(--shadow)] backdrop-blur md:p-10">
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-water-bright">
            En vivo
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-4xl tracking-wide text-ink md:text-5xl">
            Impacto de la campaña
          </h2>
        </div>
        <p className="max-w-sm text-sm text-ink-muted">
          Números públicos que también pueden mostrar socios y sponsors.
          Actualización automática.
        </p>
      </div>

      <div className="mb-6 h-3 overflow-hidden rounded-full bg-bg">
        <div
          className="h-full rounded-full bg-gradient-to-r from-water to-duck transition-all duration-700"
          style={{ width: `${Math.min(100, stats.progress)}%` }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Participaciones"
          value={participants.toLocaleString("es-AR")}
          hint="Patos adoptados"
        />
        <StatCard
          label="Recaudado"
          value={formatARS(raised)}
          hint={`Meta ${formatARS(stats.goal)}`}
          glow
        />
        <StatCard
          label="Avance"
          value={`${progressShown}%`}
          hint="Del objetivo de campaña"
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  glow,
}: {
  label: string;
  value: string;
  hint: string;
  glow?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-line bg-bg/50 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">{label}</p>
      <p
        className={`mt-2 font-[family-name:var(--font-display)] text-4xl tracking-wide text-duck md:text-5xl ${glow ? "animate-count-glow" : ""}`}
      >
        {value}
      </p>
      <p className="mt-2 text-sm text-ink-muted">{hint}</p>
    </div>
  );
}
