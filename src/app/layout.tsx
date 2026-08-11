import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Pato Race 2026 | Carrera de patos solidaria",
  description:
    "La carrera de patos solidaria más grande de Argentina. Dique 3, Puerto Madero. 70% a beneficio. Adoptá tu pato y participá.",
  openGraph: {
    title: "Pato Race 2026",
    description:
      "Carrera de patos solidaria en Puerto Madero. 70% a beneficio de Garrahan y Fundación Gardel.",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">{children}</body>
    </html>
  );
}
