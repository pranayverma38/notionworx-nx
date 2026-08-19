import CompareButton from "@/components/common/CompareButton";
import QuickViewButton from "@/components/common/QuickViewButton";
import AddToCartButton from "@/components/common/AddToCartButton";

import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { collectionHeadphoneProducts } from "@/data/collectionHeadphone";
import type { CollectionProduct } from "@/types/collectionProduct";
import WishlistButton from "@/components/common/WishlistButton";

import CountdownTimer from "@/components/common/Countdown";
import React from "react";

function ProductCard({ product }: { product: CollectionProduct }) {
  const hoverImg = product.imgHover ?? product.img;
  const badgeClass =
    product.badge === "NEW"
      ? "new"
      : product.badge === "-25%"
        ? "sale"
        : undefined;

  return (
    <div className="card-product style-5 wow fadeInUp">
      <div className="card-product_wrapper square">
        <Link href={`/product-detail/${product.id}`} className="product-img">
          <Image
            className="img-product"
            src={`${product.img}`}
            alt={product.name}
            width={330}
            height={330}
            loading="lazy"
          />
          <Image
            className="img-hover"
            src={`${hoverImg}`}
            alt={product.name}
            width={330}
            height={330}
            loading="lazy"
          />
        </Link>
        <ul className="product-action_list">
          <li className="wishlist">
            <WishlistButton product={product} />
          </li>
          <li className="compare">
            <CompareButton product={product} />
          </li>
          <li>
            <QuickViewButton product={product} />
          </li>
        </ul>
        {product.badge != null && badgeClass != null && (
          <ul className="product-badge_list">
            <li className={`product-badge_item text-caption-01 ${badgeClass}`}>
              {product.badge}
            </li>
          </ul>
        )}
        {product.countdown != null && (
          <div className="product-countdown">
            <div className="js-countdown cd-has-zero">
              <CountdownTimer style={1} />
            </div>
          </div>
        )}
        {product.marquee != null && (
          <div className="product-marquee_sale">
            <div className="marquee-wrapper">
              <div className="initial-child-container">
                {[1, 2, 3, 4, 5].map((i) => (
                  <React.Fragment key={i}>
                    <div className="marquee-child-item">{product.marquee}</div>
                    <i className="icon icon-Star2" aria-hidden />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="product-action_bot">
          <AddToCartButton
            product={product}
            href="#shoppingCart"
            dataToggle="offcanvas"
            label="Add to Cart"
          />
        </div>
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
            <i key={i} className="icon icon-Star" aria-hidden />
          ))}
        </div>
        <div className="price-wrap">
          <span className="price-new text-primary fw-semibold">
            ${product.price}
          </span>
          {product.priceOld != null && (
            <span className="price-old cl-text-3">${product.priceOld}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function Collection() {
  return (
    <section>
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">The Active Collection</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Ideal companion for the gym, running, or daily commute.
          </p>
        </div>
        <TfSwiper
          preview={4}
          tablet={3}
          mobileSm={2}
          mobile={1}
          spaceLg={30}
          spaceMd={20}
          space={10}
          paginationSm={1}
          paginationMd={3}
          paginationLg={4}
          paginationClassName="sw-dot-default tf-sw-pagination"
          className="wrap-sw-over"
        >
          {collectionHeadphoneProducts.map((product) => (
            <ProductCard key={product.img} product={product} />
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}

export default Collection;
