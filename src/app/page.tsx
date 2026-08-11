import Link from "next/link";
import { Countdown } from "@/components/countdown";
import { DuckMark, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { StatsDashboard } from "@/components/stats-dashboard";
import { campaign, formatARS } from "@/lib/campaign";
import { getPublicStats } from "@/lib/db/store";

export const dynamic = "force-dynamic";

const faqs = [
  {
    q: "¿Puedo participar sin ir al Dique 3?",
    a: "Sí. Adoptás tu pato online, recibís tu ticket digital y competís a distancia. El día del evento vas a conocer qué pato te tocó.",
  },
  {
    q: "¿Cómo se asigna el pato?",
    a: "48 horas antes de la carrera te avisamos tu número de ticket y el pato que te tocó al azar. Si ese pato gana, ganás.",
  },
  {
    q: "¿Cuántas personas comparten un pato?",
    a: `Se estiman ${campaign.peoplePerDuck} personas por pato. Si ese pato gana, el premio de ${formatARS(campaign.prizePerDuck)} se reparte entre quienes lo adoptaron.`,
  },
  {
    q: "¿A dónde va el dinero?",
    a: "El 70% de lo recaudado va a beneficio. El Hospital Garrahan concentra la mayor parte; también participa la Fundación Gardel. Los costos del evento dependen en parte de los sponsors.",
  },
  {
    q: "¿Qué incluye el ticket?",
    a: `Participación en la carrera de patos, comprobante digital con número único y enlace para compartir. Valor aproximado: ${formatARS(campaign.ticketPrice)}.`,
  },
];

export default async function Home() {
  const stats = await getPublicStats();

  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Impacto />
        <ComoFunciona />
        <section id="stats" className="section-pad">
          <div className="mx-auto max-w-6xl">
            <StatsDashboard initial={stats} />
          </div>
        </section>
        <Sponsors />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden water-mesh">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:justify-center md:px-8 md:pb-24 md:pt-20">
        <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="animate-rise">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-water-bright">
              {campaign.city} · {campaign.eventDateLabel}
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(4.5rem,16vw,9rem)] leading-[0.85] tracking-wide text-ink">
              PATO
              <br />
              <span className="text-duck">RACE</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-ink-muted md:text-xl">
              {campaign.tagline}. {campaign.benefitPercent}% a beneficio. Adoptá
              tu pato y sumate a la carrera del Dique 3.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/participar"
                className="rounded-full bg-duck px-7 py-3.5 text-base font-semibold text-bg transition hover:bg-duck-deep"
              >
                Adoptá tu pato · {formatARS(campaign.ticketPrice)}
              </Link>
              <a
                href="#como"
                className="rounded-full border border-line px-6 py-3.5 text-base text-ink transition hover:border-ink/40"
              >
                Cómo funciona
              </a>
            </div>
          </div>

          <div className="relative animate-rise" style={{ animationDelay: "120ms" }}>
            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-water/30 animate-ripple" />
            <div
              className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-duck/20 animate-ripple"
              style={{ animationDelay: "1s" }}
            />
            <div className="relative mx-auto flex max-w-sm flex-col gap-6 rounded-[2rem] border border-line bg-bg/35 p-6 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-duck text-bg animate-float-duck">
                  <DuckMark className="h-8 w-8" />
                </span>
                <div>
                  <p className="font-[family-name:var(--font-display)] text-2xl tracking-wide">
                    {campaign.location}
                  </p>
                  <p className="text-sm text-ink-muted">
                    {campaign.races} carreras · {campaign.eventDuration}
                  </p>
                </div>
              </div>
              <Countdown targetIso={campaign.eventDate.toISOString()} />
              <p className="text-sm text-ink-muted">
                Podés participar aunque no vayas al evento. Tu ticket vale igual.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Impacto() {
  return (
    <section id="impacto" className="section-pad border-t border-line bg-bg-elevated">
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
            Buscamos una recaudación grande para el Garrahan y aliados. Un
            evento divertido, masivo y con impacto real en Puerto Madero.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {campaign.beneficiaries.map((b) => (
            <article
              key={b.name}
              className="rounded-3xl border border-line bg-bg/40 p-6"
            >
              <p className="font-[family-name:var(--font-display)] text-4xl text-duck">
                {b.share}
              </p>
              <h3 className="mt-2 text-xl font-semibold">{b.name}</h3>
              <p className="mt-2 text-sm text-ink-muted">{b.description}</p>
            </article>
          ))}
          <article className="rounded-3xl border border-line bg-gradient-to-br from-water/20 to-duck/10 p-6 sm:col-span-2">
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
      title: "Adoptá tu pato",
      body: `Completá tus datos y pagá ${formatARS(campaign.ticketPrice)} con Mercado Pago.`,
    },
    {
      n: "02",
      title: "Recibí tu ticket",
      body: "Te damos un número único de participación y comprobante digital para compartir.",
    },
    {
      n: "03",
      title: "Te asignamos el pato",
      body: "48 horas antes de la carrera, tu ticket se vincula al azar con un pato (ej. Juan).",
    },
    {
      n: "04",
      title: "Si gana, ganás",
      body: `Si ese pato gana, el premio de ${formatARS(campaign.prizePerDuck)} se reparte entre quienes lo adoptaron.`,
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
              className="rounded-3xl border border-line bg-bg-soft/60 p-6"
            >
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
    <section id="sponsors" className="section-pad border-y border-line bg-bg-elevated">
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
            Según el aporte, cada sponsor recibe una cantidad de patos y
            visibilidad en la campaña. VIP con catering y show de luces el día
            del evento.
          </p>
        </div>
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
        <div className="mt-8 divide-y divide-line border-y border-line">
          {faqs.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="cursor-pointer list-none text-lg font-semibold marker:content-none">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <span className="text-duck transition group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-ink-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="section-pad pt-0">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-line bg-gradient-to-br from-water/30 via-bg-elevated to-duck/20 px-6 py-14 text-center md:px-12">
        <h2 className="font-[family-name:var(--font-display)] text-5xl tracking-wide md:text-6xl">
          ¿Listo para entrar al agua?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-ink-muted">
          Adoptá tu pato, compartí tu ticket y ayudá a que Pato Race sea la
          carrera solidaria más grande del país.
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
