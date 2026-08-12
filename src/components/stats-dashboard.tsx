"use client";

import { useEffect, useState } from "react";
import { formatARS } from "@/lib/campaign";
import type { PublicStats } from "@/lib/db/store";

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
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
  const raised = useCountUp(stats.raised);
  const participants = useCountUp(stats.participants);
  const progress = useCountUp(Math.round(stats.progress));

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as PublicStats;
        setStats(data);
      } catch {
        /* ignore polling errors */
      }
    }, 8000);
    return () => clearInterval(id);
  }, []);

  if (compact) {
    return (
      <div className="rounded-[1.5rem] border-2 border-duck/35 bg-[#13302e]/95 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.3)] backdrop-blur">
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-water-bright">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-coral" />
            </span>
            Campaña en vivo
          </p>
          <p className="text-[11px] font-semibold text-ink-muted">
            Meta {formatARS(stats.goal)}
          </p>
        </div>
        <div className="mb-4 h-2 overflow-hidden rounded-full bg-bg">
          <div
            className="h-full rounded-full bg-gradient-to-r from-water-bright to-duck transition-all duration-700"
            style={{ width: `${Math.min(100, stats.progress)}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <CompactStat
            label="Adopciones"
            value={participants.toLocaleString("es-AR")}
          />
          <CompactStat label="Recaudado" value={formatARS(raised)} />
          <CompactStat label="Avance" value={`${progress}%`} />
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
          value={`${progress}%`}
          hint="Del objetivo de campaña"
        />
      </div>
    </div>
  );
}

function CompactStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-bg/55 px-2 py-3 text-center">
      <p className="font-[family-name:var(--font-display)] text-xl tracking-wide text-duck sm:text-2xl">
        {value}
      </p>
      <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted sm:text-[10px]">
        {label}
      </p>
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
