import { redirect } from "next/navigation";

import SiteShell from "@/components/layouts/SiteShell";
import { getAuthenticatedCustomer } from "@/lib/medusa/customer-session";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customer = await getAuthenticatedCustomer();

  if (!customer) {
    redirect("/login");
  }

  return <SiteShell>{children}</SiteShell>;
}
