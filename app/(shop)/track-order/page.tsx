import PageTitle from "@/components/shop/track-order/PageTitle";
import OrderTracking from "@/components/shop/track-order/OrderTracking";
import { shopRouteMetadata } from "@/lib/metadata/shop";

export const metadata = shopRouteMetadata(
  "Track order",
  "Enter your details to check the status of your order.",
);

const TrackOrderPage = () => {
  return (
    <>
      <PageTitle />
      <OrderTracking />
    </>
  );
};

export default TrackOrderPage;
