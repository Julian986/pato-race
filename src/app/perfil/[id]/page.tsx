import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintReceiptButton } from "@/components/print-receipt-button";
import { ProfileRemember } from "@/components/profile-lookup-form";
import { ShareActions } from "@/components/share-actions";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { campaign, formatARS } from "@/lib/campaign";
import {
  getParticipantById,
  getPaymentByParticipantId,
} from "@/lib/db/store";
import { getDuckPersona } from "@/lib/duck-persona";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const participant = await getParticipantById(id);
  if (!participant) return { title: "Perfil | Pato Race" };
  return {
    title: `${participant.name.split(" ")[0]} · ${participant.ticketCode} | Pato Race`,
    description: `Perfil de participación de ${participant.name} en Pato Race 2026.`,
  };
}

export default async function ProfilePage({
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
  const paymentStatus = approved
    ? "approved"
    : (payment?.status ?? "pending");
  const duck = getDuckPersona(participant.ticketCode);
  const firstName = participant.name.trim().split(/\s+/)[0] ?? participant.name;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:6632";
  const shareUrl = `${siteUrl}/perfil/${participant.id}`;
  const paidAt = payment?.updatedAt
    ? new Date(payment.updatedAt).toLocaleString("es-AR", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";
  const registeredAt = new Date(participant.createdAt).toLocaleString("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <>
      <ProfileRemember id={participant.id} />
      <SiteHeader />
      <main className="water-mesh flex-1 pt-24 print:bg-white print:pt-0">
        {/* Hero perfil */}
        <section className="relative overflow-hidden border-b border-line print:hidden">
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-water/30 blur-3xl" />
            <div className="absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-duck/20 blur-3xl" />
          </div>
          <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 py-12 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-16">
            <div className="animate-rise min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-bg/50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-ink-muted">
                <span
                  className={`h-2 w-2 rounded-full ${
                    approved ? "bg-[#25D366]" : "bg-duck"
                  }`}
                />
                {approved ? "Participación activa" : "Pago pendiente"}
              </div>
              <h1 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2.8rem,8vw,5.5rem)] leading-[0.9] tracking-wide text-ink">
                HOLA,{" "}
                <span className="text-duck">{firstName.toUpperCase()}</span>
              </h1>
              <p className="mt-4 max-w-lg text-base text-ink-muted md:text-lg">
                Este es tu centro de carrera. Acá tenés tu pato, el ticket y el
                comprobante listo para compartir o imprimir.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#comprobante"
                  className="fun-button rounded-full bg-duck px-5 py-3 text-sm font-black text-bg"
                >
                  Ver comprobante
                </a>
                <a
                  href="#compartir"
                  className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink transition hover:border-ink/40"
                >
                  Compartir
                </a>
              </div>
            </div>

            <div className="animate-rise relative mx-auto w-full max-w-sm">
              <div
                className="relative overflow-hidden rounded-[2rem] border-2 border-duck/60 bg-bg-elevated/80 p-5 shadow-[8px_8px_0_rgba(154,116,0,0.55)]"
                style={{ boxShadow: `8px 8px 0 ${duck.accent}66` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ink-muted">
                      {duck.statusLabel}
                    </p>
                    <p className="mt-1 font-[family-name:var(--font-display)] text-3xl tracking-wide text-ink">
                      {duck.displayName}
                    </p>
                  </div>
                  <span
                    className="rounded-xl px-3 py-2 font-[family-name:var(--font-display)] text-2xl tracking-wide text-bg"
                    style={{ background: duck.accent }}
                  >
                    #{duck.bib}
                  </span>
                </div>

                <div className="relative mx-auto mt-4 aspect-square w-[78%]">
                  <div className="absolute inset-6 rounded-full bg-water/20 blur-2xl" />
                  <Image
                    src="/pato_corre.webp"
                    alt={`Pato ${duck.displayName}`}
                    fill
                    sizes="280px"
                    className="animate-float-duck object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
                    priority
                  />
                </div>

                <p className="mt-3 text-center text-sm text-ink-muted">
                  {duck.trait}
                </p>
                <p className="mt-2 rounded-2xl border border-dashed border-line bg-bg/40 px-3 py-2 text-center text-xs text-ink-muted">
                  El pato oficial se confirma 48 hs antes de la carrera. Esta es
                  tu identidad de carrera mientras tanto.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl space-y-10 px-5 py-12 md:px-8 md:py-16">
          {/* Ticket */}
          <section className="animate-rise print:hidden">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-water-bright">
              Tu ticket
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl tracking-wide md:text-5xl">
              ENTRADA DIGITAL
            </h2>
            <div className="mt-6 overflow-hidden rounded-[2rem] border border-line bg-bg-elevated/85 shadow-[var(--shadow)]">
              <div className="grid md:grid-cols-[1.2fr_0.8fr]">
                <div className="border-b border-line p-6 md:border-b-0 md:border-r md:p-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">
                    Número de ticket
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-display)] text-5xl tracking-wide text-duck md:text-6xl">
                    {participant.ticketCode}
                  </p>
                  <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                    <Meta label="Participante" value={participant.name} />
                    <Meta label="DNI" value={participant.dni} />
                    <Meta label="Email" value={participant.email} />
                    <Meta label="Teléfono" value={participant.phone} />
                  </dl>
                </div>
                <div className="flex flex-col justify-between gap-6 bg-bg/40 p-6 md:p-8">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">
                      Evento
                    </p>
                    <p className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-wide text-ink">
                      PATO RACE {campaign.year}
                    </p>
                    <p className="mt-2 text-sm text-ink-muted">
                      {campaign.location}
                      <br />
                      {campaign.eventDateLabel}
                      <br />
                      {campaign.eventTimeLabel}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-duck/30 bg-duck/10 px-4 py-3">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-duck">
                      Estado
                    </p>
                    <p className="mt-1 text-lg font-semibold text-ink">
                      {statusLabel(paymentStatus)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Comprobante */}
          <section id="comprobante" className="scroll-mt-28 animate-rise">
            <div className="flex flex-wrap items-end justify-between gap-4 print:hidden">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-water-bright">
                  Comprobante de pago
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl tracking-wide md:text-5xl">
                  RECIBO OFICIAL
                </h2>
              </div>
              <PrintReceiptButton />
            </div>

            <div
              id="recibo-print"
              className="mt-6 overflow-hidden rounded-[2rem] border border-line bg-bg-elevated/90 p-6 shadow-[var(--shadow)] md:p-8 print:rounded-none print:border-ink print:bg-white print:p-0 print:text-black print:shadow-none"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6 print:border-black/20">
                <div>
                  <p className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-ink print:text-black">
                    PATO RACE {campaign.year}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted print:text-neutral-600">
                    Comprobante digital de adopción solidaria
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.18em] text-ink-muted print:text-neutral-500">
                    Ticket
                  </p>
                  <p className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-duck print:text-black">
                    {participant.ticketCode}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <ReceiptRow label="Titular" value={participant.name} />
                <ReceiptRow label="DNI" value={participant.dni} />
                <ReceiptRow label="Email" value={participant.email} />
                <ReceiptRow label="Teléfono" value={participant.phone} />
                <ReceiptRow
                  label="Concepto"
                  value={`Adopción de pato — ${campaign.name} ${campaign.year}`}
                />
                <ReceiptRow
                  label="Monto"
                  value={formatARS(payment?.amount ?? campaign.ticketPrice)}
                />
                <ReceiptRow label="Estado" value={statusLabel(paymentStatus)} />
                <ReceiptRow label="Fecha de registro" value={registeredAt} />
                <ReceiptRow
                  label="Última actualización de pago"
                  value={paidAt}
                />
                <ReceiptRow
                  label="Referencia interna"
                  value={payment?.id?.slice(0, 8).toUpperCase() ?? "—"}
                />
                {payment?.mpPaymentId ? (
                  <ReceiptRow
                    label="ID Mercado Pago"
                    value={payment.mpPaymentId}
                  />
                ) : null}
              </div>

              {mock === "1" ? (
                <p className="mt-6 rounded-2xl border border-water/30 bg-water/10 px-4 py-3 text-sm text-ink-muted print:border-neutral-300 print:bg-neutral-50 print:text-neutral-700">
                  Modo demo: pago simulado (sin Mercado Pago configurado).
                </p>
              ) : null}

              <p className="mt-8 text-xs leading-relaxed text-ink-muted print:text-neutral-600">
                El {campaign.benefitPercent}% de lo recaudado se destina a
                causas solidarias ({campaign.beneficiaries.map((b) => b.name).join(", ")}
                ). Conservá este comprobante como constancia de tu participación.
                Evento: {campaign.location} · {campaign.eventDateLabel} ·{" "}
                {campaign.eventTimeLabel}.
              </p>
            </div>
          </section>

          {/* Share */}
          <section
            id="compartir"
            className="scroll-mt-28 animate-rise rounded-[2rem] border border-duck/35 bg-gradient-to-br from-duck/15 via-bg-elevated/80 to-water/10 p-6 md:p-8 print:hidden"
          >
            <p className="text-xs font-black uppercase tracking-[0.25em] text-duck">
              Viralizá la causa
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl tracking-wide md:text-5xl">
              COMPARTÍ TU PERFIL
            </h2>
            <p className="mt-3 max-w-xl text-sm text-ink-muted md:text-base">
              Mandá tu vínculo a amigos y redes. Cada adopción suma a la
              recaudación solidaria.
            </p>
            <div className="mt-6">
              <ShareActions
                ticketCode={participant.ticketCode}
                shareUrl={shareUrl}
                name={participant.name}
              />
            </div>
          </section>

          <div className="flex flex-wrap gap-3 print:hidden">
            <Link
              href="/"
              className="rounded-full border border-line px-5 py-2.5 text-sm transition hover:border-ink/40"
            >
              Volver al inicio
            </Link>
            <Link
              href="/participar"
              className="rounded-full bg-duck px-5 py-2.5 text-sm font-semibold text-bg transition hover:bg-duck-deep"
            >
              Adoptar otro pato
            </Link>
          </div>
        </div>
      </main>
      <div className="print:hidden">
        <SiteFooter />
      </div>
    </>
  );
}

function statusLabel(status: string) {
  switch (status) {
    case "approved":
      return "Pago aprobado";
    case "pending":
      return "Pago pendiente";
    case "rejected":
      return "Pago rechazado";
    case "cancelled":
      return "Pago cancelado";
    default:
      return status;
  }
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.15em] text-ink-muted">
        {label}
      </dt>
      <dd className="mt-1 break-all font-medium text-ink">{value}</dd>
    </div>
  );
}

function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-bg/35 px-4 py-3 print:rounded-none print:border-neutral-200 print:bg-transparent">
      <p className="text-[11px] uppercase tracking-[0.15em] text-ink-muted print:text-neutral-500">
        {label}
      </p>
      <p className="mt-1 break-all font-medium text-ink print:text-black">
        {value}
      </p>
    </div>
  );
}
