import { MercadoPagoConfig, Preference } from "mercadopago";
import { campaign } from "@/lib/campaign";

const accessToken = process.env.MP_ACCESS_TOKEN?.trim();

export function hasMercadoPago(): boolean {
  return Boolean(accessToken);
}

function client() {
  if (!accessToken) throw new Error("MP_ACCESS_TOKEN no configurado");
  return new MercadoPagoConfig({ accessToken });
}

export async function createCheckoutPreference(input: {
  paymentId: string;
  participantId: string;
  ticketCode: string;
  payerEmail: string;
  payerName: string;
}): Promise<{ id: string; initPoint: string; mock: boolean }> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:6632";

  if (!hasMercadoPago()) {
    const mockId = `mock-pref-${input.paymentId}`;
    return {
      id: mockId,
      initPoint: `${siteUrl}/api/mp/mock-pay?paymentId=${input.paymentId}`,
      mock: true,
    };
  }

  const preference = new Preference(client());
  const result = await preference.create({
    body: {
      items: [
        {
          id: input.ticketCode,
          title: `Pato Race 2026 — Ticket ${input.ticketCode}`,
          quantity: 1,
          unit_price: campaign.ticketPrice,
          currency_id: "ARS",
        },
      ],
      payer: {
        email: input.payerEmail,
        name: input.payerName,
      },
      external_reference: input.paymentId,
      metadata: {
        payment_id: input.paymentId,
        participant_id: input.participantId,
        ticket_code: input.ticketCode,
      },
      back_urls: {
        success: `${siteUrl}/ticket/${input.participantId}?status=approved`,
        failure: `${siteUrl}/participar?status=failure`,
        pending: `${siteUrl}/ticket/${input.participantId}?status=pending`,
      },
      auto_return: "approved",
      notification_url: `${siteUrl}/api/mp/webhook`,
    },
  });

  const id = result.id;
  const initPoint = result.init_point || result.sandbox_init_point;
  if (!id || !initPoint) {
    throw new Error("No se pudo crear la preferencia de Mercado Pago");
  }

  return { id, initPoint, mock: false };
}
