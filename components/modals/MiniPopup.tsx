"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductCardItem } from "@/types/productCard";

interface MiniPopupProps {
  product: ProductCardItem;
}

export default function MiniPopup({ product }: MiniPopupProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`pop-notice-sale ${isActive ? "active" : ""}`}>
      <div
        className="btn-cl-pop link cs-pointer"
        onClick={() => setIsActive(false)}
      >
        <i className="icon icon-X2" />
      </div>
      <div className="pns-thumb">
        <div className="image">
          <Image
            loading="lazy"
            width={63}
            height={84}
            src={product.img}
            alt={product.name}
          />
        </div>
        <div className="purchase">
          <svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.5 2.5H2.5C2.23478 2.5 1.98043 2.60536 1.79289 2.79289C1.60536 2.98043 1.5 3.23478 1.5 3.5V12.5C1.5 12.7652 1.60536 13.0196 1.79289 13.2071C1.98043 13.3946 2.23478 13.5 2.5 13.5H13.5C13.7652 13.5 14.0196 13.3946 14.2071 13.2071C14.3946 13.0196 14.5 12.7652 14.5 12.5V3.5C14.5 3.23478 14.3946 2.98043 14.2071 2.79289C14.0196 2.60536 13.7652 2.5 13.5 2.5ZM2.5 4.5V3.5H13.5V4.5H2.5Z"
              fill="white"
            />
            <path
              d="M11.1469 7.11756L7.37458 10.8225C7.2801 10.9153 7.15295 10.9673 7.0205 10.9673C6.88806 10.9673 6.76091 10.9153 6.66643 10.8225L5.04973 9.23485C5.00238 9.18835 4.96465 9.13298 4.93869 9.0719C4.91274 9.01082 4.89906 8.94522 4.89846 8.87886C4.89723 8.74483 4.9493 8.61581 5.04321 8.52017C5.08971 8.47282 5.14508 8.43509 5.20616 8.40913C5.26724 8.38317 5.33283 8.3695 5.39919 8.3689C5.53322 8.36767 5.66224 8.41974 5.75788 8.51365L7.02093 9.75396L10.4391 6.39679C10.5347 6.30288 10.6637 6.25079 10.7977 6.25197C10.9317 6.25316 11.0597 6.30752 11.1536 6.4031C11.2475 6.49868 11.2996 6.62765 11.2984 6.76164C11.2972 6.89563 11.2425 7.02366 11.1469 7.11756Z"
              fill="#DC4646"
            />
          </svg>
        </div>
      </div>
      <div className="pns-content">
        <p className="mb-4 text-caption-01 cl-text-2">
          Nathan Collins has purchased!
        </p>
        <Link
          href={`/product-detail/${product.id}`}
          className="fw-medium link mb-12 lh-24"
        >
          {product.name}
        </Link>
        <div className="bottom">
          <div className="pns_date">
            <svg
              width={12}
              height={12}
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z"
                stroke="#696E73"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 3V6L8 7"
                stroke="#696E73"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-caption-01 cl-text-2"> 12 mins ago </span>
          </div>
          <Link
            href={`/product-detail/${product.id}`}
            className="tf-btn-line-2 style-primary"
          >
            <span className="fw-semibold text-caption-01"> View Products </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
