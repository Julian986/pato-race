import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareActions } from "@/components/share-actions";
import { DuckMark, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { campaign, formatARS } from "@/lib/campaign";
import {
  getParticipantById,
  getPaymentByParticipantId,
} from "@/lib/db/store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const participant = await getParticipantById(id);
  if (!participant) return { title: "Ticket | Pato Race" };
  return {
    title: `Ticket ${participant.ticketCode} | Pato Race 2026`,
    description: `Comprobante de participación de ${participant.name} en Pato Race 2026.`,
  };
}

export default async function TicketPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string; mock?: string }>;
}) {
  const { id } = await params;
  const { status, mock } = await searchParams;
  const participant = await getParticipantById(id);
  if (!participant) notFound();

  const payment = await getPaymentByParticipantId(participant.id);
  const approved = payment?.status === "approved" || status === "approved";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:6632";
  const shareUrl = `${siteUrl}/ticket/${participant.id}`;

  return (
    <>
      <SiteHeader />
      <main className="water-mesh flex-1 pt-24">
        <div className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
          <div className="rounded-[2rem] border border-line bg-bg-elevated/85 p-6 shadow-[var(--shadow)] backdrop-blur md:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-water-bright">
                  {approved ? "Pago confirmado" : "Ticket pendiente"}
                </p>
                <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl tracking-wide md:text-5xl">
                  Comprobante digital
                </h1>
              </div>
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-duck text-bg">
                <DuckMark className="h-8 w-8" />
              </span>
            </div>

            <div className="mt-8 rounded-3xl border border-duck/30 bg-bg/50 p-6 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-ink-muted">
                Número de ticket
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-5xl tracking-wide text-duck md:text-6xl">
                {participant.ticketCode}
              </p>
              <p className="mt-3 text-sm text-ink-muted">
                Guardá este número. 48 hs antes de la carrera te avisamos qué
                pato te tocó.
              </p>
            </div>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <Info label="Participante" value={participant.name} />
              <Info label="DNI" value={participant.dni} />
              <Info label="Email" value={participant.email} />
              <Info label="Teléfono" value={participant.phone} />
              <Info
                label="Monto"
                value={formatARS(payment?.amount ?? campaign.ticketPrice)}
              />
              <Info
                label="Estado"
                value={
                  approved
                    ? "Aprobado"
                    : payment?.status === "pending"
                      ? "Pendiente"
                      : (payment?.status ?? "—")
                }
              />
            </dl>

            {mock === "1" ? (
              <p className="mt-6 rounded-2xl border border-water/30 bg-water/10 px-4 py-3 text-sm text-ink-muted">
                Modo demo: pago simulado (sin Mercado Pago configurado).
              </p>
            ) : null}

            <div className="mt-8 space-y-3">
              <p className="text-sm font-semibold">Compartí tu participación</p>
              <ShareActions
                ticketCode={participant.ticketCode}
                shareUrl={shareUrl}
                name={participant.name}
              />
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-full border border-line px-5 py-2.5 text-sm transition hover:border-ink/40"
              >
                Volver al inicio
              </Link>
              <Link
                href="/#stats"
                className="rounded-full bg-duck px-5 py-2.5 text-sm font-semibold text-bg transition hover:bg-duck-deep"
              >
                Ver recaudación
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-bg/40 px-4 py-3">
      <dt className="text-xs uppercase tracking-[0.15em] text-ink-muted">
        {label}
      </dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}
