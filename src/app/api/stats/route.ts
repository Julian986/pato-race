import { NextResponse } from "next/server";
import { getPublicStats } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const stats = await getPublicStats();
  return NextResponse.json(stats, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
