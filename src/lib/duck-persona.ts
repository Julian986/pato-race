/** Persona visual provisional del pato hasta la asignación real (48 hs antes). */

const NAMES = [
  "Relámpago",
  "Cuacktor",
  "Naranja Mecánica",
  "Dique Dash",
  "Gardelito",
  "Pico Veloz",
  "Marea Amarilla",
  "Turbo Cuac",
  "Puerto Flash",
  "Solidario",
  "Garrahán",
  "Splash",
] as const;

const TRAITS = [
  "Sale como bólido en la largada",
  "Nada con estilo porteño",
  "Especialista en curvas del dique",
  "Motivado por la causa solidaria",
  "Le gusta la foto finish",
  "Corre con la hinchada en la cabeza",
] as const;

const ACCENTS = [
  "#f5c518",
  "#3ec9e0",
  "#ff5a45",
  "#e8f6f4",
  "#1aa6c1",
  "#e0a800",
] as const;

function hashCode(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

export type DuckPersona = {
  displayName: string;
  bib: string;
  trait: string;
  accent: string;
  assigned: false;
  statusLabel: string;
};

export function getDuckPersona(ticketCode: string): DuckPersona {
  const h = hashCode(ticketCode.toUpperCase());
  const name = NAMES[h % NAMES.length];
  const trait = TRAITS[(h >>> 8) % TRAITS.length];
  const accent = ACCENTS[(h >>> 16) % ACCENTS.length];
  const bib = String(100 + (h % 900)).padStart(3, "0");

  return {
    displayName: name,
    bib,
    trait,
    accent,
    assigned: false,
    statusLabel: "Pato en camino",
  };
}
