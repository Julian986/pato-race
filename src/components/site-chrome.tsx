import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-duck shadow-[0_0_0_3px_rgba(245,197,24,0.22)] transition group-hover:scale-105">
            <Image
              src="/foto_pato2.webp"
              alt="Pato Race"
              fill
              sizes="40px"
              className="object-cover object-center"
              priority
            />
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
          <Link href="/perfil" className="hover:text-ink transition">
            Mi perfil
          </Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/perfil"
            className="rounded-full border border-line px-3 py-2 text-sm font-semibold text-ink transition hover:border-ink/40 md:hidden"
          >
            Mi perfil
          </Link>
          <Link
            href="/participar"
            className="rounded-full bg-duck px-4 py-2 text-sm font-semibold text-bg transition hover:bg-duck-deep"
          >
            Adoptá tu pato
          </Link>
        </div>
      </div>
    </header>
  );
}

export function DuckMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <span className={`relative inline-block overflow-hidden rounded-full ${className}`}>
      <Image
        src="/foto_pato2.webp"
        alt=""
        fill
        sizes="32px"
        className="object-cover object-center"
        aria-hidden
      />
    </span>
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
