import { Metadata } from "next";

import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountDashboard from "@/components/account/account-page/AccountDashboard";

export const metadata: Metadata = {
  title: "My Account | Notion Worx",
  description: "Manage your Notion Worx account details, saved items, and storefront activity.",
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
