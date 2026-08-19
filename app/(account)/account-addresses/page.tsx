import { Metadata } from "next";
import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountAddresses from "@/components/account/account-addresses/AccountAddresses";

export const metadata: Metadata = {
  title: "My Address | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
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
