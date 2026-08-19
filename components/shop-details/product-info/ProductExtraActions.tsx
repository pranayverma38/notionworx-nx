"use client";

import { ProductCardItem } from "@/types/productCard";
import CompareButton from "../../common/CompareButton";

export function ProductExtraActions({
  product,
}: {
  product?: ProductCardItem;
}) {
  return (
    <div className="tf-product-extra-link">
      <CompareButton
        className="product-extra-icon link"
        product={product}
        variant="extra"
      />
      <a href="#ask" data-bs-toggle="modal" className="product-extra-icon link">
        <i className="icon icon-Question" />
        Ask A Question
      </a>
      <a
        href="#findSize"
        data-bs-toggle="modal"
        className="product-extra-icon link"
      >
        <i className="icon icon-Ruler" />
        Size Guide
      </a>
      <a
        href="#share"
        data-bs-toggle="modal"
        className="product-extra-icon link"
      >
        <i className="icon icon-ShareNetwork" />
        Share
      </a>
    </div>
  );
}
