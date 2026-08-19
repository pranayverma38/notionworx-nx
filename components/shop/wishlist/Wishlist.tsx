"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useContextElement } from "@/context/Context";
import type { ProductCardItem } from "@/types/productCard";

function WishlistItem({
  cardVariant,
  product,
  removeFromWishlist,
}: {
  cardVariant: string;
  product: ProductCardItem;
  removeFromWishlist: (id: string | number) => void;
}) {
  const defaultImage = product.img || "/assets/images/product/product-1.jpg";
  const [activeImage, setActiveImage] = useState(defaultImage);
  const activeHoverImage =
    activeImage === defaultImage
      ? (product.imgHover ?? defaultImage)
      : activeImage;

  return (
    <div className="card-product">
      <div className={`card-product_wrapper ${cardVariant}`}>
        <Link href={`/product-detail/${product.id}`} className="product-img">
          <Image
            className="img-product"
            loading="lazy"
            width={330}
            height={440}
            src={activeImage}
            alt={product.name}
          />
          <Image
            className="img-hover"
            loading="lazy"
            width={330}
            height={440}
            src={activeHoverImage}
            alt={product.name}
          />
        </Link>
        <ul className="product-action_list">
          <li className="compare">
            <a
              href="#compare"
              data-bs-toggle="offcanvas"
              className="hover-tooltip tooltip-left box-icon"
            >
              <span className="icon icon-ArrowsLeftRight" />
              <span className="tooltip">Compare</span>
            </a>
          </li>
          <li>
            <a
              href="#quickView"
              data-bs-toggle="offcanvas"
              className="hover-tooltip tooltip-left box-icon"
            >
              <span className="icon icon-Eye" />
              <span className="tooltip">Quick view</span>
            </a>
          </li>
        </ul>
        {product.badge && (
          <ul className="product-badge_list">
            <li
              className={`product-badge_item text-caption-01 ${
                product.badge.toLowerCase() === "new" ? "new" : "sale"
              }`}
            >
              {product.badge}
            </li>
          </ul>
        )}
        <span
          className="product-action_remove remove box-icon hover-tooltip tooltip-left"
          onClick={() => removeFromWishlist(product.id)}
          style={{ cursor: "pointer" }}
        >
          <i className="icon icon-trash" />
          <span className="tooltip">Remove</span>
        </span>
        <div className="product-action_bot">
          <a
            href="#quickAdd"
            data-bs-toggle="modal"
            className="tf-btn btn-white small w-100"
          >
            Quick Add
          </a>
        </div>
        {product.marquee && (
          <div className="product-marquee_sale">
            <div className="marquee-wrapper">
              <div className="initial-child-container">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="marquee-child-item">
                    {product.marquee}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="card-product_info">
        <Link
          href={`/product-detail/${product.id}`}
          className="name-product lh-24 fw-medium link-underline-text"
        >
          {product.name}
        </Link>
        <div className="star-wrap d-flex align-items-center">
          {[...Array(5)].map((_, i) => (
            <i key={i} className="icon icon-Star" />
          ))}
        </div>
        <div className="price-wrap">
          <span className="price-new text-primary fw-semibold">
            ${product.price}
          </span>
          {product.priceOld && (
            <span className="price-old text-caption-01 cl-text-3">
              ${product.priceOld}
            </span>
          )}
        </div>
        {product.colors && product.colors.length > 0 && (
          <ul className="product-color_list">
            {product.colors.map((color, idx) => (
              <li
                key={idx}
                onMouseEnter={() => setActiveImage(color.img)}
                className={`product-color-item color-swatch hover-tooltip tooltip-bot ${
                  activeImage === color.img ? "active" : ""
                }`}
              >
                <span className="tooltip color-filter">{color.label}</span>
                <span className={`swatch-value ${color.swatchClass}`} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Wishlist() {
  const { wishList, removeFromWishlist } = useContextElement();

  return (
    <>
      <div className="section-wishlist flat-spacing">
        <div className="container">
          {wishList && wishList.length > 0 ? (
            <div className="tf-grid-layout tf-col-2 md-col-3 xl-col-4 wrapper-wishlist">
              {wishList.map((product) => (
                <WishlistItem
                  key={product.id}
                  cardVariant={"square"}
                  product={product as ProductCardItem}
                  removeFromWishlist={removeFromWishlist}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <h3>Your wishlist is empty</h3>
              <p className="mb-4">
                You haven&apos;t added any products to your wishlist yet.
              </p>
              <Link href="/shop-default" className="tf-btn btn-primary">
                Return to Shop
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Wishlist;
