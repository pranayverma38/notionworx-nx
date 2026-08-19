import { Metadata } from "next";
import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountAddresses from "@/components/account/account-addresses/AccountAddresses";

export const metadata: Metadata = {
  title: "My Address | Notion Worx",
  description: "Manage the addresses associated with your Notion Worx storefront account.",
};

const AccountAddressesPage = () => {
  return (
    <>
      <AccountPageTitle />
      <AccountAddresses />
    </>
  );
};

export default AccountAddressesPage;
