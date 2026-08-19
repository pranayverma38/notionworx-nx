import Log from "@/components/shop/register/Log";
import PageTitle from "@/components/shop/register/PageTitle";
import { shopRouteMetadata } from "@/lib/metadata/shop";

export const metadata = shopRouteMetadata(
  "Register",
  "Create your account to save favorites, checkout faster, and manage orders.",
);

const RegisterPage = () => {
  return (
    <>
      <PageTitle />
      <Log />
    </>
  );
};

export default RegisterPage;
