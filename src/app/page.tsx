import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/countdown";
import { FaqAccordion } from "@/components/faq-accordion";
import { DuckMark, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { StatsDashboard } from "@/components/stats-dashboard";
import { campaign, formatARS } from "@/lib/campaign";
import { getPublicStats, type PublicStats } from "@/lib/db/store";

export const dynamic = "force-dynamic";

const faqs = [
  {
    q: "¿Puedo participar sin ir al Dique 3?",
    a: "Sí. Podés comprar tu participación online y ser parte de la carrera desde cualquier lugar.",
  },
  {
    q: "¿Cómo se asigna el pato?",
    a: "48 horas antes de la carrera te informaremos qué pato quedó asignado a tu ticket.",
  },
  {
    q: "¿Cuántas personas comparten un pato?",
    a: `Cada pato podrá representar aproximadamente a ${campaign.peoplePerDuck} personas. Si ese pato gana, el premio de ${formatARS(campaign.prizePerDuck)} se reparte entre quienes lo adoptaron.`,
  },
  {
    q: "¿A dónde va el dinero?",
    a: "El 70% de lo recaudado va a beneficio: 50% al Hospital Garrahan, 10% a Fundación Gardel y 10% a otra causa solidaria que será anunciada por la organización. El 30% restante cubre producción y costos del evento, que se reducen con el apoyo de sponsors.",
  },
  {
    q: "¿Qué incluye el ticket?",
    a: `Tu participación en la carrera, ticket digital con número único y enlace para compartir. Valor aproximado: ${formatARS(campaign.ticketPrice)}.`,
  },
];

export default async function Home() {
  const stats = await getPublicStats();

  return (
    <>
      <SiteHeader />
      <main>
        <Hero stats={stats} />
        <QueEs />
        <Sponsors />
        <Impacto />
        <ComoFunciona />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}

function Hero({ stats }: { stats: PublicStats }) {
  return (
    <section className="relative min-h-[100svh] overflow-hidden hero-party">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
      <div className="pointer-events-none absolute -left-20 top-28 h-52 w-52 rounded-full bg-coral/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full bg-duck/25 blur-3xl" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pb-14 pt-24 md:px-8 md:pb-20 md:pt-28">
        <div className="grid grid-cols-[1.15fr_0.85fr] items-center gap-3 sm:gap-6 md:gap-10">
          <div className="animate-rise min-w-0">
            <p className="mb-4 inline-flex w-fit max-w-full flex-col gap-0.5 rounded-2xl border-2 border-duck bg-duck px-3 py-2 text-bg shadow-[0_5px_0_#9a7400] sm:mb-6 sm:flex-row sm:items-center sm:gap-2 sm:rounded-full sm:px-4 sm:py-2.5">
              <span className="font-[family-name:var(--font-display)] text-base tracking-wide sm:text-lg md:text-xl">
                {campaign.city}
              </span>
              <span className="hidden text-bg/40 sm:inline" aria-hidden>
                ·
              </span>
              <span className="text-[11px] font-black uppercase tracking-wide sm:text-sm md:text-base">
                {campaign.eventDateLabel}
                <span className="mx-1.5 text-bg/40" aria-hidden>
                  ·
                </span>
                {campaign.eventTimeLabel}
              </span>
            </p>

            <h1 className="hero-title font-[family-name:var(--font-display)] text-[clamp(3.4rem,12vw,9.5rem)] leading-[0.78] tracking-wide text-ink">
              PATO
              <br />
              <span className="relative inline-block text-duck">
                RACE
                <span className="absolute -right-10 -top-3 rotate-12 rounded-full bg-foam px-2.5 py-1 font-[family-name:var(--font-body)] text-[10px] font-black tracking-normal text-bg [text-shadow:none] sm:-right-14 sm:text-xs md:-right-20 md:text-sm">
                  ¡CUAC!
                </span>
              </span>
            </h1>

            <p className="mt-4 max-w-md text-sm text-ink-muted sm:mt-6 sm:text-lg md:text-xl">
              {campaign.tagline}. {campaign.benefitPercent}% a beneficio. Adoptá
              tu pato y sumate a la carrera del Dique 3.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">
              <Link
                href="/participar"
                className="fun-button whitespace-nowrap rounded-full bg-duck px-5 py-3 text-sm font-black text-bg sm:px-7 sm:py-3.5 sm:text-base"
              >
                Adoptá tu pato · {formatARS(campaign.ticketPrice)}
              </Link>
              <a
                href="#como"
                className="rounded-full border border-line px-5 py-3 text-sm text-ink transition hover:border-ink/40 sm:px-6 sm:py-3.5 sm:text-base"
              >
                Cómo participar
              </a>
            </div>
          </div>

          <div
            className="relative animate-rise self-center"
            style={{ animationDelay: "120ms" }}
          >
            <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-duck/80 animate-ripple sm:h-48 sm:w-48 md:h-72 md:w-72" />
            <div
              className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-water-bright/30 animate-ripple sm:h-64 sm:w-64 sm:border-4 md:h-96 md:w-96"
              style={{ animationDelay: "1s" }}
            />
            <div className="relative mx-auto w-full max-w-[160px] animate-float-duck sm:max-w-[260px] md:max-w-[400px]">
              <div className="relative aspect-square overflow-hidden rounded-[42%_58%_45%_55%/55%_42%_58%_45%] border-[4px] border-duck bg-[#15120d] shadow-[0_20px_50px_rgba(0,0,0,0.45)] sm:border-[5px] md:border-[6px]">
                <Image
                  src="/foto_pato2.png"
                  alt="Pato corredor con casco argentino y anteojos"
                  fill
                  priority
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 35vw, 400px"
                  className="object-cover"
                />
              </div>
              <span className="absolute -right-1 bottom-4 rotate-6 rounded-full bg-water-bright px-2 py-1 text-[9px] font-black text-bg shadow-xl sm:-right-3 sm:bottom-8 sm:px-3 sm:py-1.5 sm:text-xs md:bottom-10 md:px-4 md:py-2 md:text-sm">
                70% SOLIDARIO
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-[0.9fr_1.1fr] md:items-stretch">
          <div className="rotate-1 rounded-[1.5rem] border-2 border-line bg-[#13302e] p-4 text-ink shadow-[0_14px_36px_rgba(0,0,0,0.28)] sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="font-[family-name:var(--font-display)] text-xl tracking-wide sm:text-2xl">
                  {campaign.location}
                </p>
                <p className="text-[11px] font-semibold text-ink-muted sm:text-xs">
                  {campaign.races} carreras · {campaign.eventDuration}
                </p>
              </div>
              <span className="rounded-full bg-duck px-3 py-1 text-[10px] font-black text-bg sm:text-xs">
                FALTA
              </span>
            </div>
            <Countdown targetIso={campaign.eventDate.toISOString()} />
          </div>

          <div id="stats" className="min-w-0">
            <StatsDashboard initial={stats} compact />
          </div>
        </div>
      </div>
      <div className="hero-wave pointer-events-none absolute inset-x-0 bottom-0 h-8 md:h-12" />
    </section>
  );
}

function QueEs() {
  const highlights = [
    {
      value: `${campaign.races}`,
      label: "carreras de patos",
      detail: "Dos carreras dentro de una jornada de aproximadamente dos horas.",
    },
    {
      value: campaign.peoplePerDuck,
      label: "personas por pato",
      detail: "Cada pato puede ser compartido por un grupo de participantes.",
    },
    {
      value: formatARS(campaign.prizePerDuck),
      label: "de premio",
      detail: "Si tu pato gana, el premio se reparte entre quienes lo adoptaron.",
    },
  ];

  return (
    <section id="que-es" className="section-pad border-t border-line bg-bg-elevated">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-water-bright">
              ¿Qué es Pato Race?
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide md:text-7xl">
              Una carrera donde tu pato{" "}
              <span className="text-duck">corre por vos</span>
            </h2>
          </div>
          <div className="space-y-4 text-base leading-relaxed text-ink-muted md:text-lg">
            <p>
              Pato Race es un evento solidario y masivo en el que miles de
              patitos participan en una carrera sobre el agua en Puerto Madero.
            </p>
            <p>
              Cada persona compra una participación y recibe un número de
              ticket. Luego, 48 horas antes de la carrera, ese ticket se
              vincula al azar con un pato. Si ese pato gana, ganás junto a las
              demás personas a las que les tocó ese mismo pato.
            </p>
            <p>
              Es una propuesta pensada para divertir, convocar y recaudar fondos
              para causas benéficas, permitiendo que participe gente tanto de
              manera presencial como a distancia.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.label}
              className="fun-card rounded-3xl border border-line bg-bg/45 p-6"
            >
              <p className="font-[family-name:var(--font-display)] text-4xl tracking-wide text-duck">
                {item.value}
              </p>
              <h3 className="mt-1 text-sm font-black uppercase tracking-[0.14em]">
                {item.label}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {item.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Impacto() {
  return (
    <section id="beneficio" className="section-pad border-t border-line bg-bg-elevated">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-water-bright">
            A beneficio
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide md:text-6xl">
            {campaign.benefitPercent}% va a
            <span className="text-duck"> causas solidarias</span>
          </h2>
          <p className="mt-5 max-w-md text-ink-muted">
            El 70% de lo recaudado por Pato Race será destinado a causas
            solidarias.
          </p>
          <div className="mt-4 space-y-2 text-sm text-ink-muted">
            <p>50% para el Hospital Garrahan</p>
            <p>10% para Fundación Gardel</p>
            <p>10% destinado a otra causa solidaria a definir por la organización</p>
          </div>
          <p className="mt-4 max-w-md rounded-2xl border border-line bg-bg-elevated/70 px-4 py-3 text-sm text-ink-muted">
            El 30% restante cubre producción y costos del evento. El apoyo de
            sponsors ayuda a reducir esos costos y aumentar el impacto.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {campaign.beneficiaries.map((b) => (
            <article
              key={b.name}
              className="fun-card rounded-3xl border border-line bg-bg/40 p-6"
            >
              <p className="font-[family-name:var(--font-display)] text-4xl text-duck">
                {b.share}
              </p>
              <h3 className="mt-2 text-xl font-semibold">{b.name}</h3>
              <p className="mt-2 text-sm text-ink-muted">{b.description}</p>
            </article>
          ))}
          <article className="fun-card rounded-3xl border border-line bg-gradient-to-br from-water/20 to-duck/10 p-6 sm:col-span-3">
            <h3 className="font-[family-name:var(--font-display)] text-3xl tracking-wide">
              Meta ambiciosa
            </h3>
            <p className="mt-2 text-ink-muted">
              Objetivo de convocatoria: llegar a una audiencia masiva en el
              dique y online. Cada adopción suma al contador público.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

function ComoFunciona() {
  const steps = [
    {
      n: "01",
      title: "Comprá tu participación",
      body: `Adoptás tu pato por un valor aproximado de ${formatARS(campaign.ticketPrice)} a través de Mercado Pago.`,
    },
    {
      n: "02",
      title: "Recibí tu ticket",
      body: "Te enviamos un comprobante digital con tu número único de participación.",
    },
    {
      n: "03",
      title: "Esperá la asignación",
      body: "48 horas antes de la carrera, te avisamos qué pato te tocó al azar.",
    },
    {
      n: "04",
      title: "Seguí la carrera",
      body: `Si tu pato resulta ganador, compartís el premio de ${formatARS(campaign.prizePerDuck)} con las demás personas asignadas a ese mismo pato.`,
    },
  ];

  return (
    <section id="como" className="section-pad">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.25em] text-water-bright">
            Cómo participar
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide md:text-6xl">
            Simple, divertido y solidario
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <article
              key={step.n}
              className="fun-card group relative overflow-hidden rounded-3xl border border-line bg-bg-soft/60 p-6"
            >
              <span className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-duck/10 transition group-hover:scale-150" />
              <p className="font-[family-name:var(--font-display)] text-4xl text-duck/80">
                {step.n}
              </p>
              <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {step.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Sponsors() {
  return (
    <section id="sponsors" className="section-pad border-y border-line bg-bg">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-water-bright">
              Sponsors
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-wide">
              Marcas que hacen posible la carrera
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink-muted">
            Pato Race busca sumar marcas y aliados que quieran ser parte de una
            experiencia única, masiva y con impacto social real.
          </p>
        </div>
        <p className="mb-8 max-w-3xl text-ink-muted">
          El aporte de los sponsors ayuda a potenciar el evento, ampliar su
          alcance y reducir costos de producción, permitiendo que una mayor
          parte de la recaudación llegue a destino.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {campaign.sponsors.map((s) => (
            <div
              key={s.name}
              className="flex h-28 items-center justify-center rounded-3xl border border-dashed border-line bg-bg/30"
            >
              <span className="text-sm uppercase tracking-[0.2em] text-ink-muted">
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="section-pad">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-[family-name:var(--font-display)] text-5xl tracking-wide">
          Preguntas frecuentes
        </h2>
        <FaqAccordion items={faqs} />
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="section-pad pt-0">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-line bg-gradient-to-br from-water/30 via-bg-elevated to-duck/20 px-6 py-14 text-center md:px-12">
        <h2 className="font-[family-name:var(--font-display)] text-5xl tracking-wide md:text-6xl">
          Sumate a la carrera solidaria más grande del país
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-ink-muted">
          Adoptá tu pato, compartí tu participación y ayudanos a convertir esta
          carrera en una gran acción solidaria.
        </p>
        <Link
          href="/participar"
          className="mt-8 inline-flex rounded-full bg-duck px-8 py-3.5 text-base font-semibold text-bg transition hover:bg-duck-deep"
        >
          Adoptá tu pato ahora
        </Link>
      </div>
    </section>
  );
}
