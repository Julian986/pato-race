import { NextResponse } from "next/server";
import { approvePaymentById, getPaymentById } from "@/lib/db/store";

/** Checkout simulado cuando no hay MP_ACCESS_TOKEN (sandbox local). */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get("paymentId");
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:6632";

  if (!paymentId) {
    return NextResponse.redirect(`${siteUrl}/participar?status=failure`);
  }

  const payment = await getPaymentById(paymentId);
  if (!payment) {
    return NextResponse.redirect(`${siteUrl}/participar?status=failure`);
  }

  const approved = await approvePaymentById(paymentId, `mock-${Date.now()}`);
  if (!approved) {
    return NextResponse.redirect(`${siteUrl}/participar?status=failure`);
  }

  return NextResponse.redirect(
    `${siteUrl}/perfil/${approved.participant.id}?status=approved&mock=1`,
  );
}
