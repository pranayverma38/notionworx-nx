"use client";
import { useState } from "react";
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

export default function ProductInfoCustomerNote({
  product,
}: {
  product: ProductCardItem;
}) {
  const { registerPane } = useProduct();
  const [fileName, setFileName] = useState("Upload Image");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

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

          <form
            className="tf-product-customer-note"
            onSubmit={(e) => e.preventDefault()}
          >
            <p className="mb-4">Add your personalization</p>
            <p className="mb-12 text-caption-01 cl-text-2">
              Add your name, note or upload your customized idea image to
              personalise your item
            </p>
            <fieldset className="mb-8">
              <input
                type="text"
                placeholder="Customize Note"
                name="text"
                required
              />
            </fieldset>
            <div className="tf-product-image-upload uploadfile">
              <label htmlFor="upLoad">
                <span className="filename">{fileName}</span>
                <input
                  id="upLoad"
                  type="file"
                  name="file"
                  className="d-none"
                  onChange={handleFileChange}
                />
                <span className="btn-up text-caption-01 fw-semibold">
                  Upload
                </span>
              </label>
            </div>
          </form>

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
