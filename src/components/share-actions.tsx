"use client";

import { useState } from "react";

export function ShareActions({
  ticketCode,
  shareUrl,
  name,
}: {
  ticketCode: string;
  shareUrl: string;
  name: string;
}) {
  const [copied, setCopied] = useState(false);
  const text = `¡Adopté mi pato en Pato Race 2026! Ticket ${ticketCode}. Sumate vos también:`;
  const wa = `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex flex-1 items-center justify-center rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-bg transition hover:brightness-110"
      >
        Compartir por WhatsApp
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex flex-1 items-center justify-center rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink transition hover:border-ink/40"
      >
        {copied ? "¡Enlace copiado!" : "Copiar enlace"}
      </button>
      <p className="sr-only">
        {name}, compartí tu participación {ticketCode}
      </p>
    </div>
  );
}
