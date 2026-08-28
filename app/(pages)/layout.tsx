import SiteShell from "@/components/layouts/SiteShell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
