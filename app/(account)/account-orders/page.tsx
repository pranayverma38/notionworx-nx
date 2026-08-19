import { Metadata } from "next";

import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountOrders from "@/components/account/account-orders/AccountOrders";

export const metadata: Metadata = {
  title: "Your Orders | Notion Worx",
  description: "Review your Notion Worx order history and current storefront order activity.",
};

const AccountOrdersPage = () => {
  return (
    <>
      <AccountPageTitle />
      <AccountOrders />
    </>
  );
};

export default AccountOrdersPage;
