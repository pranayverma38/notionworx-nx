import { Metadata } from "next";

import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountDashboard from "@/components/account/account-page/AccountDashboard";

export const metadata: Metadata = {
  title: "My Account | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};

const AccountPage = () => {
  return (
    <>
      <AccountPageTitle />
      <AccountDashboard />
    </>
  );
};

export default AccountPage;
