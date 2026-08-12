import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-duck text-bg shadow-[0_0_0_4px_rgba(245,197,24,0.2)] transition group-hover:scale-105">
            <DuckMark className="h-6 w-6" />
          </span>
          <span className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-ink">
            PATO RACE
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-ink-muted md:flex">
          <a href="/#que-es" className="hover:text-ink transition">
            Qué es
          </a>
          <a href="/#sponsors" className="hover:text-ink transition">
            Sponsors
          </a>
          <a href="/#beneficio" className="hover:text-ink transition">
            Beneficio
          </a>
          <a href="/#como" className="hover:text-ink transition">
            Cómo participar
          </a>
        </nav>
        <Link
          href="/participar"
          className="rounded-full bg-duck px-4 py-2 text-sm font-semibold text-bg transition hover:bg-duck-deep"
        >
          Adoptá tu pato
        </Link>
      </div>
    </header>
  );
}

export function DuckMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M12 38c0-12 10-22 24-22 8 0 14 3 18 8 4 1 8 5 8 10 0 6-5 10-11 10H22c-6 0-10-3-10-6z"
        fill="currentColor"
      />
      <circle cx="42" cy="28" r="2.5" fill="#061821" />
      <path d="M50 30c4 0 8 2 9 4-3 1-6 1-9 0v-4z" fill="#ff5a45" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-bg-elevated">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-ink-muted md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="font-[family-name:var(--font-display)] text-xl tracking-wide text-ink">
            PATO RACE 2026
          </p>
          <p>Evento a beneficio · Buenos Aires · Dique 3, Puerto Madero</p>
        </div>
        <p className="max-w-md md:text-right">
          El 70% de lo recaudado se destina a causas solidarias. Participás con
          tu ticket aunque no asistas al dique.
        </p>
      </div>
    </footer>
  );
}
