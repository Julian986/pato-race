import Link from "next/link";
import { ProfileAccessPanel } from "@/components/profile-access";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const metadata = {
  title: "Mi perfil | Pato Race 2026",
  description:
    "Iniciá sesión o abrí tu ticket de Pato Race: patos, comprobante y enlace para compartir.",
};

export default function PerfilAccessPage() {
  return (
    <>
      <SiteHeader />
      <main className="water-mesh flex-1 pt-24">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 py-12 md:grid-cols-[1.05fr_0.95fr] md:items-center md:px-8 md:py-20">
          <div className="animate-rise">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-water-bright">
              Área de participantes
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide text-ink md:text-7xl">
              MI PERFIL
            </h1>
            <p className="mt-4 max-w-md text-base text-ink-muted md:text-lg">
              Iniciá sesión para ver tus patos, o abrí un ticket si ya adoptaste.
              Si todavía no participaste, tu cuenta arranca en cero y desde ahí
              adoptás.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-ink-muted">
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-duck" />
                Login para seguir tus patos en un solo lugar
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-water-bright" />
                Opción alternativa con número de ticket
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-coral" />
                Tras el pago confirmado, el ticket se suma a tu cuenta
              </li>
            </ul>
            <p className="mt-8 text-sm text-ink-muted">
              ¿Todavía no adoptaste?{" "}
              <Link
                href="/participar"
                className="font-semibold text-duck hover:underline"
              >
                Adoptá tu pato
              </Link>
            </p>
          </div>

          <div className="animate-rise rounded-[2rem] border border-line bg-bg-elevated/90 p-6 shadow-[var(--shadow)] backdrop-blur md:p-8">
            <p className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-ink">
              Entrá
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              Dos caminos: cuenta o ticket.
            </p>
            <div className="mt-6">
              <ProfileAccessPanel />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
