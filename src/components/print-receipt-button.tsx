"use client";

export function PrintReceiptButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-ink/40 print:hidden"
    >
      Descargar / imprimir comprobante
    </button>
  );
}
