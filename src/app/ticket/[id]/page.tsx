import { redirect } from "next/navigation";

/** Compatibilidad: el comprobante vive ahora en el perfil. */
export default async function TicketRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string; mock?: string }>;
}) {
  const { id } = await params;
  const q = await searchParams;
  const qs = new URLSearchParams();
  if (q.status) qs.set("status", q.status);
  if (q.mock) qs.set("mock", q.mock);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  redirect(`/perfil/${id}${suffix}`);
}
