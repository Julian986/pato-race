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
  const full = `${text} ${shareUrl}`;
  const wa = `https://wa.me/?text=${encodeURIComponent(full)}`;
  const x = `https://twitter.com/intent/tweet?text=${encodeURIComponent(full)}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function nativeShare() {
    if (!navigator.share) {
      await copy();
      return;
    }
    try {
      await navigator.share({ title: "Pato Race 2026", text, url: shareUrl });
    } catch {
      /* cancelado */
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-bg transition hover:brightness-110"
        >
          WhatsApp
        </a>
        <a
          href={x}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center rounded-full border border-line bg-bg/40 px-5 py-3 text-sm font-semibold text-ink transition hover:border-ink/40"
        >
          X / Twitter
        </a>
        <a
          href={fb}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center rounded-full border border-line bg-bg/40 px-5 py-3 text-sm font-semibold text-ink transition hover:border-ink/40"
        >
          Facebook
        </a>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={copy}
          className="inline-flex flex-1 items-center justify-center rounded-full border border-duck/50 bg-duck/10 px-5 py-3 text-sm font-semibold text-duck transition hover:bg-duck/20"
        >
          {copied ? "¡Enlace copiado!" : "Copiar enlace"}
        </button>
        <button
          type="button"
          onClick={nativeShare}
          className="inline-flex flex-1 items-center justify-center rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink transition hover:border-ink/40"
        >
          Más opciones
        </button>
      </div>
      <p className="break-all rounded-2xl border border-dashed border-line bg-bg/30 px-4 py-3 font-mono text-xs text-ink-muted">
        {shareUrl}
      </p>
      <p className="sr-only">
        {name}, compartí tu participación {ticketCode}
      </p>
    </div>
  );
}
