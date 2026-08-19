import { Metadata } from "next";

import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountSetting from "@/components/account/account-setting/AccountSetting";

export const metadata: Metadata = {
  title: "Account Settings | Notion Worx",
  description: "Update your Notion Worx account preferences and profile settings.",
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
