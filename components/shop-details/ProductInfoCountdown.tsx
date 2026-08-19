"use client";
import { useEffect } from "react";
import { useProduct } from "@/context/ProductContext";
import { ProductCardItem } from "@/types/productCard";
import {
  ProductTitle,
  ProductPrice,
  ProductShortDescription,
  ProductViews,
  ProductVariantPicker,
  ProductQuantityBuy,
  ProductExtraActions,
  ProductDelivery,
  ProductSafeCheckout,
} from "./product-info";
import CountdownTimer from "../common/Countdown";

export default function ProductInfoCountdown({
  product,
}: {
  product: ProductCardItem;
}) {
  const { registerPane } = useProduct();

  useEffect(() => {
    // Note: In a real app, we'd use a robust countdown library or a custom hook.
    // Here we'll just ensure the data-timer is set as in the design.
  }, []);

  return (
    <div className="col-md-6">
      <div className="tf-product-info-wrap position-relative mt-md-0">
        <div ref={registerPane} className="tf-zoom-main sticky-top" />
        <div className="tf-product-info-list other-image-zoom">
          <div className="tf-product-info-heading">
            <ProductTitle product={product} />
            <ProductPrice product={product} />
            <ProductShortDescription />
            <ProductViews />
          </div>

          <div className="br-line" />

          <div className="tf-product-info-countdown type-box">
            <div className="countdown-title">
              <svg
                className="tf-ani-tada"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.78104 3.53104L2.78104 6.53104C2.64031 6.67177 2.44944 6.75083 2.25042 6.75083C2.05139 6.75083 1.86052 6.67177 1.71979 6.53104C1.57906 6.39031 1.5 6.19944 1.5 6.00042C1.5 5.80139 1.57906 5.61052 1.71979 5.46979L4.71979 2.46979C4.86052 2.32906 5.05139 2.25 5.25042 2.25C5.44944 2.25 5.64031 2.32906 5.78104 2.46979C5.92177 2.61052 6.00083 2.80139 6.00083 3.00042C6.00083 3.19944 5.92177 3.39031 5.78104 3.53104ZM22.281 5.46979L19.281 2.46979C19.1403 2.32906 18.9494 2.25 18.7504 2.25C18.5514 2.25 18.3605 2.32906 18.2198 2.46979C18.0791 2.61052 18 2.80139 18 3.00042C18 3.19944 18.0791 3.39031 18.2198 3.53104L21.2198 6.53104C21.2895 6.60072 21.3722 6.656 21.4632 6.69371C21.5543 6.73142 21.6519 6.75083 21.7504 6.75083C21.849 6.75083 21.9465 6.73142 22.0376 6.69371C22.1286 6.656 22.2114 6.60072 22.281 6.53104C22.3507 6.46136 22.406 6.37863 22.4437 6.28759C22.4814 6.19654 22.5008 6.09896 22.5008 6.00042C22.5008 5.90187 22.4814 5.80429 22.4437 5.71324C22.406 5.6222 22.3507 5.53947 22.281 5.46979ZM21.0004 12.7504C21.0004 14.5304 20.4726 16.2705 19.4836 17.7505C18.4947 19.2306 17.0891 20.3841 15.4446 21.0653C13.8 21.7465 11.9904 21.9247 10.2446 21.5775C8.49878 21.2302 6.89513 20.373 5.63646 19.1144C4.37778 17.8557 3.52062 16.2521 3.17335 14.5062C2.82608 12.7604 3.00431 10.9508 3.6855 9.30627C4.36669 7.66173 5.52024 6.25612 7.00029 5.26719C8.48033 4.27826 10.2204 3.75042 12.0004 3.75042C14.3865 3.75315 16.6741 4.70223 18.3614 6.38947C20.0486 8.07671 20.9977 10.3643 21.0004 12.7504ZM18.0004 12.7504C18.0004 12.5515 17.9214 12.3607 17.7807 12.2201C17.6401 12.0794 17.4493 12.0004 17.2504 12.0004H12.7504V7.50042C12.7504 7.3015 12.6714 7.11074 12.5307 6.97009C12.3901 6.82943 12.1993 6.75042 12.0004 6.75042C11.8015 6.75042 11.6107 6.82943 11.4701 6.97009C11.3294 7.11074 11.2504 7.3015 11.2504 7.50042V12.7504C11.2504 12.9493 11.3294 13.1401 11.4701 13.2807C11.6107 13.4214 11.8015 13.5004 12.0004 13.5004H17.2504C17.4493 13.5004 17.6401 13.4214 17.7807 13.2807C17.9214 13.1401 18.0004 12.9493 18.0004 12.7504Z"
                  fill="black"
                />
              </svg>
              <div className="h6">Hurry up offer ends in:</div>
            </div>
            <div className="countdown-v05">
              <div className="js-countdown">
                <CountdownTimer style={2} />
              </div>
            </div>
          </div>

          <div className="tf-product-variant">
            <ProductVariantPicker />
            <ProductQuantityBuy product={product} />
          </div>

          <ProductExtraActions />

          <div className="br-line" />

          <ProductDelivery />
          <ProductSafeCheckout />
        </div>
      </div>
    </div>
  );
}
