import { Metadata } from "next";

import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountSetting from "@/components/account/account-setting/AccountSetting";

export const metadata: Metadata = {
  title: "Setting | Amerce - Multipurpose eCommerce React Nextjs Template",
  description: "Amerce - Multipurpose eCommerce React Nextjs Template",
};

const AccountSettingPage = () => {
  return (
    <>
      <AccountPageTitle />
      <AccountSetting />
    </>
  );
};

export default AccountSettingPage;
