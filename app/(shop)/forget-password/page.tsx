import PageTitle from "@/components/shop/forget-password/PageTitle";
import Log from "@/components/shop/forget-password/Log";
import { shopRouteMetadata } from "@/lib/metadata/shop";

export const metadata = shopRouteMetadata(
  "Forgot password",
  "Request a link or code to reset your account password.",
);

const ForgetPasswordPage = () => {
  return (
    <>
      <PageTitle />
      <Log />
    </>
  );
};

export default ForgetPasswordPage;
