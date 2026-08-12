export const campaign = {
  name: "Pato Race",
  year: 2026,
  tagline: "La carrera de patos solidaria más grande de Argentina",
  location: "Dique 3 · Puerto Madero",
  city: "Buenos Aires",
  /** Fecha aproximada del evento (21–22 nov 2026) */
  eventDate: new Date("2026-11-21T15:00:00-03:00"),
  eventDateLabel: "21–22 de noviembre 2026",
  eventTimeLabel: "15:00 a 17:00",
  ticketPrice: Number(process.env.TICKET_PRICE ?? 10_000),
  goalAmount: Number(process.env.GOAL_AMOUNT ?? 100_000_000),
  benefitPercent: 70,
  peoplePerDuck: "20–30",
  prizePerDuck: 500_000,
  races: 2,
  eventDuration: "≈ 2 horas",
  beneficiaries: [
    {
      name: "Hospital Garrahan",
      share: "50%",
      description: "Principal destino solidario de la recaudación.",
    },
    {
      name: "Fundación Gardel",
      share: "10%",
      description: "Parte del 70% destinado a beneficio social.",
    },
    {
      name: "Otras causas solidarias",
      share: "10%",
      description: "Entidad beneficiaria a anunciar por la organización.",
    },
  ],
  sponsors: [
    { name: "Sponsor Oro", tier: "oro" },
    { name: "Sponsor Plata", tier: "plata" },
    { name: "Sponsor Bronce", tier: "bronce" },
  ],
} as const;

export function formatARS(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}
