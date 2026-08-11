import { NextResponse } from "next/server";
import {
  approvePaymentById,
  approvePaymentByPreference,
  getPaymentById,
  updatePayment,
} from "@/lib/db/store";
import { hasMercadoPago } from "@/lib/mp";
import { MercadoPagoConfig, Payment } from "mercadopago";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const topic =
      url.searchParams.get("topic") ||
      url.searchParams.get("type") ||
      undefined;
    const body = (await request.json().catch(() => ({}))) as {
      type?: string;
      action?: string;
      data?: { id?: string };
      id?: string;
    };

    const type = topic || body.type || body.action;
    const paymentId = body.data?.id || url.searchParams.get("id") || body.id;

    if (type?.includes("payment") && paymentId && hasMercadoPago()) {
      const client = new MercadoPagoConfig({
        accessToken: process.env.MP_ACCESS_TOKEN!,
      });
      const paymentApi = new Payment(client);
      const payment = await paymentApi.get({ id: paymentId });
      const externalRef = payment.external_reference;
      const status = payment.status;

      if (externalRef && status === "approved") {
        await approvePaymentById(externalRef, String(payment.id));
      } else if (externalRef && status) {
        const mapped =
          status === "rejected" || status === "cancelled"
            ? status
            : status === "pending" || status === "in_process"
              ? "pending"
              : "pending";
        await updatePayment(externalRef, {
          status: mapped as "pending" | "rejected" | "cancelled",
          mpPaymentId: String(payment.id),
        });
      }

      const paymentData = payment as typeof payment & {
        preference_id?: string | number;
      };
      const preferenceId = paymentData.preference_id
        ? String(paymentData.preference_id)
        : null;
      if (preferenceId && status === "approved") {
        await approvePaymentByPreference(preferenceId, String(payment.id));
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("webhook error", error);
    // Always 200 to avoid MP retry storms during setup
    return NextResponse.json({ ok: true });
  }
}

export async function GET(request: Request) {
  // MP sometimes probes with GET
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get("paymentId");
  if (paymentId) {
    const payment = await getPaymentById(paymentId);
    return NextResponse.json({ payment });
  }
  return NextResponse.json({ ok: true });
}
