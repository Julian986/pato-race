import { AccountDashboard } from "@/components/account-dashboard";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const metadata = {
  title: "Mi cuenta | Pato Race 2026",
  description:
    "Tu cuenta de Pato Race: patos adoptados, tickets y accesos a la carrera.",
};

export default function CuentaPage() {
  return (
    <>
      <SiteHeader />
      <main className="water-mesh flex-1 pt-24">
        <AccountDashboard />
      </main>
      <SiteFooter />
    </>
  );
}
