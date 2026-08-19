import { Metadata } from "next";

import InvoiceContent from "@/components/pages/invoice/InvoiceContent";

export const metadata: Metadata = {
  title: "Invoice | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};

const InvoicePage = () => {
  return (
    <>
      <InvoiceContent />
    </>
  );
};

export default InvoicePage;
