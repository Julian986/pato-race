import { NextResponse } from "next/server";
import { createCheckoutPreference } from "@/lib/mp";
import { createParticipant, updatePayment } from "@/lib/db/store";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      return NextResponse.json({ fieldErrors }, { status: 400 });
    }

    const { participant, payment } = await createParticipant(parsed.data);
    const preference = await createCheckoutPreference({
      paymentId: payment.id,
      participantId: participant.id,
      ticketCode: participant.ticketCode,
      payerEmail: participant.email,
      payerName: participant.name,
    });

    await updatePayment(payment.id, {
      mpPreferenceId: preference.id,
    });

    return NextResponse.json({
      ok: true,
      initPoint: preference.initPoint,
      mock: preference.mock,
      participantId: participant.id,
      ticketCode: participant.ticketCode,
    });
  } catch (error) {
    console.error("checkout error", error);
    return NextResponse.json(
      { error: "No se pudo iniciar el checkout" },
      { status: 500 },
    );
  }
}
