import PageTitle from "@/components/shop/login/PageTitle";
import Log from "@/components/shop/login/Log";
import { shopRouteMetadata } from "@/lib/metadata/shop";

export const metadata = shopRouteMetadata(
  "Login",
  "Sign in to your account to track orders, wishlists, and saved addresses.",
);

const LoginPage = () => {
  return (
    <>
      <PageTitle />
      <Log />
    </>
  );
};

export default LoginPage;
