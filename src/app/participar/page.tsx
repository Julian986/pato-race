import Link from "next/link";
import { ParticipateForm } from "@/components/participate-form";
import { DuckMark, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { campaign, formatARS } from "@/lib/campaign";

export const metadata = {
  title: "Adoptá tu pato | Pato Race 2026",
  description:
    "Registrate, pagá con Mercado Pago y recibí tu ticket digital para Pato Race 2026.",
};

export default async function ParticiparPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  return (
    <>
      <SiteHeader />
      <main className="water-mesh flex-1 pt-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[0.95fr_1.05fr] md:px-8 md:py-16">
          <div>
            <Link
              href="/"
              className="text-sm text-ink-muted transition hover:text-ink"
            >
              ← Volver
            </Link>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl tracking-wide md:text-6xl">
              Adoptá tu <span className="text-duck">pato</span>
            </h1>
            <p className="mt-4 max-w-md text-ink-muted">
              Completá tus datos de contacto. Sirven para tu ticket y también
              para que sponsors e organización puedan comunicarse.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-ink-muted">
              <li className="flex gap-3">
                <DuckMark className="mt-0.5 h-5 w-5 text-duck" />
                Ticket digital con número único
              </li>
              <li className="flex gap-3">
                <DuckMark className="mt-0.5 h-5 w-5 text-duck" />
                Participás aunque no vayas al dique
              </li>
              <li className="flex gap-3">
                <DuckMark className="mt-0.5 h-5 w-5 text-duck" />
                {campaign.benefitPercent}% a beneficio ·{" "}
                {formatARS(campaign.ticketPrice)}
              </li>
            </ul>

            {status === "failure" ? (
              <p className="mt-6 rounded-2xl border border-coral/40 bg-coral/10 px-4 py-3 text-sm">
                El pago no se completó. Podés intentar de nuevo.
              </p>
            ) : null}
          </div>

          <div className="rounded-[2rem] border border-line bg-bg-elevated/80 p-6 shadow-[var(--shadow)] backdrop-blur md:p-8">
            <ParticipateForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
