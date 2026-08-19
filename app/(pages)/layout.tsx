import Footer1 from "@/components/footers/Footer1";
import CloseNavDropdownsOnRoute from "@/components/headers/CloseNavDropdownsOnRoute";
import Header10 from "@/components/headers/Header10";
import TopBar4 from "@/components/topBars/TopBar4";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CloseNavDropdownsOnRoute />
      <TopBar4 />
      <Header10 parentClass="tf-header" containerFull hasHrLine />
      {children}
      <Footer1 />
    </>
  );
}
