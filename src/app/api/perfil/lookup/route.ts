import { NextResponse } from "next/server";
import { getParticipantByTicket, getPaymentByParticipantId } from "@/lib/db/store";

export async function POST(request: Request) {
  let body: { ticketCode?: string; email?: string };
  try {
    body = (await request.json()) as { ticketCode?: string; email?: string };
  } catch {
    return NextResponse.json(
      { ok: false, error: "Pedido inválido" },
      { status: 400 },
    );
  }

  const raw = String(body.ticketCode ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!raw || !email) {
    return NextResponse.json(
      {
        ok: false,
        error: "Ingresá tu número de ticket y el email del registro.",
      },
      { status: 400 },
    );
  }

  const digits = raw.replace(/^PR-?/, "");
  const normalized = `PR-${digits}`;

  const participant = await getParticipantByTicket(normalized);
  if (!participant || participant.email.toLowerCase() !== email) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "No encontramos ese perfil. Revisá el ticket y el email usados al adoptar.",
      },
      { status: 404 },
    );
  }

  const payment = await getPaymentByParticipantId(participant.id);

  return NextResponse.json({
    ok: true,
    profileId: participant.id,
    ticketCode: participant.ticketCode,
    paymentStatus: payment?.status ?? "pending",
  });
}
