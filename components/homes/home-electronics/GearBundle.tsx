"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { gearBundleProducts } from "@/data/products/products";
import CompareButton from "@/components/common/CompareButton";
import QuickViewButton from "@/components/common/QuickViewButton";
import WishlistButton from "@/components/common/WishlistButton";
import { ProductCardItem } from "@/types/productCard";
import { formatPrice } from "@/utils/formatPrice";
import { useContextElement } from "@/context/store";

const SLIDES_PER_VIEW = 2;
const slides = (() => {
  const pairs: [ProductCardItem, ProductCardItem][] = [];
  for (let i = 0; i < gearBundleProducts.length; i += SLIDES_PER_VIEW) {
    if (gearBundleProducts[i] && gearBundleProducts[i + 1]) {
      pairs.push([gearBundleProducts[i], gearBundleProducts[i + 1]]);
    }
  }
  return pairs;
})();

function ProductCard({
  product,
  onAddToBundle,
}: {
  product: ProductCardItem;
  onAddToBundle: (product: ProductCardItem) => void;
}) {
  return (
    <div className="card-product">
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
            src={`${product.img}`}
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
        <div className="product-action_bot">
          <button
            className="tf-btn w-100"
            onClick={() => onAddToBundle(product)}
          >
            Add to Bundle
          </button>
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
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
}

function GearBundle() {
  const { addProductToCart } = useContextElement();
  const [bundleItems, setBundleItems] = useState(
    gearBundleProducts.slice(0, 3).map((p) => ({ ...p, quantity: 1 })),
  );

  const handleAddToBundle = (product: ProductCardItem) => {
    setBundleItems((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromBundle = (id: number | string) => {
    setBundleItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: number | string, delta: number) => {
    setBundleItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const handleAddToCartAll = () => {
    bundleItems.forEach((item) => {
      addProductToCart(item, item.quantity);
    });
  };

  const subtotal = bundleItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const targetCount = 3;
  const progress = Math.min((bundleItems.length / targetCount) * 100, 100);

  return (
    <section className="section-gear-bundle flat-spacing">
      <div className="container">
        <div className="sect-heading type-2 has-col-right wow fadeInUp">
          <div>
            <h3 className="s-title">Personalize Your Own Gear Bundle</h3>
            <p className="s-desc cl-text-2 text-body-1">
              Mindful choices for everyday wellbeing.
            </p>
          </div>
          <div className="col-right">
            <Link
              href="/shop-default"
              className="tf-btn-line-2 py-4 style-primary"
            >
              <span className="fw-semibold">View All Products</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="main-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 col-xl-8">
              <div className="col-left">
                <TfSwiper
                  preview={3}
                  tablet={2}
                  mobileSm={2}
                  mobile={2}
                  spaceLg={20}
                  spaceMd={15}
                  space={10}
                  pagination={2}
                  paginationSm={2}
                  paginationMd={3}
                  paginationLg={3}
                  paginationClassName="sw-dot-default tf-sw-pagination"
                >
                  {slides.map((pair, slideIndex) => (
                    <div
                      key={pair[0].id}
                      className={`tf-list vertical wow fadeInUp ${slideIndex === 0 ? "gap-lg-30" : "gap-30"}`}
                    >
                      <ProductCard
                        product={pair[0]}
                        onAddToBundle={handleAddToBundle}
                      />
                      <ProductCard
                        product={pair[1]}
                        onAddToBundle={handleAddToBundle}
                      />
                    </div>
                  ))}
                </TfSwiper>
              </div>
            </div>
            <div className="col-lg-5 col-xl-4">
              <div className="col-right">
                <div className="box-bundle-save">
                  <h3 className="mb-4">Bundle Save</h3>
                  <p className="cl-text-2 mb-20">
                    Save more when you shop in bundles.
                  </p>
                  <div
                    className="bundle-progress progress"
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="progress-bar"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="fw-medium mt-4">
                    <span className="cl-text-2 fw-normal">Buy</span>{" "}
                    {targetCount}
                    <span className="cl-text-2 fw-normal">
                      {" "}
                      products and save up to
                    </span>{" "}
                    30%
                  </p>
                  <ul className="bundle-list mb-20">
                    {bundleItems.map((product) => (
                      <li key={product.id} className="bundle-prd file-delete">
                        <div className="prd-image">
                          <Image
                            src={product.img}
                            alt={product.name}
                            width={80}
                            height={80}
                            loading="lazy"
                          />
                        </div>
                        <div className="prd-info">
                          <Link
                            href={`/product-detail/${product.id}`}
                            className="info_name link text-body-1"
                          >
                            {product.name}
                          </Link>
                          <div className="price-wrap">
                            <span className="price-new">
                              {formatPrice(product.price)}
                            </span>
                            {product.priceOld != null && (
                              <span className="price-old text-caption-01 cl-text-2">
                                {formatPrice(product.priceOld)}
                              </span>
                            )}
                          </div>
                          <div className="info_typo text-caption-01 cl-text-3">
                            XL/Blue
                          </div>
                        </div>
                        <div className="prd-action">
                          <a
                            href="#"
                            className="tf-btn-line-3 type-primary remove"
                            onClick={(e) => {
                              e.preventDefault();
                              handleRemoveFromBundle(product.id);
                            }}
                          >
                            <span className="fw-semibold text-caption-01">
                              Remove
                            </span>
                          </a>
                          <div className="wg-quantity-v2">
                            <input
                              className="quantity-product"
                              type="text"
                              name="number"
                              value={product.quantity}
                              readOnly
                            />
                            <div className="group-action">
                              <button
                                className="btn-quantity plus-btn"
                                type="button"
                                onClick={() =>
                                  handleUpdateQuantity(product.id, 1)
                                }
                              >
                                <i
                                  className="icon icon-CaretTopThin"
                                  aria-hidden
                                />
                              </button>
                              <button
                                className="btn-quantity minus-btn"
                                type="button"
                                onClick={() =>
                                  handleUpdateQuantity(product.id, -1)
                                }
                              >
                                <i
                                  className="icon icon-CaretBottomThin"
                                  aria-hidden
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="bottom">
                    <div className="d-flex align-items-center justify-content-between mb-16">
                      <h4>Subtotal</h4>
                      <h4>{formatPrice(subtotal)}</h4>
                    </div>
                    <button
                      onClick={handleAddToCartAll}
                      data-bs-toggle="offcanvas"
                      data-bs-target="#shoppingCart"
                      className="tf-btn animate-btn w-100"
                      disabled={bundleItems.length === 0}
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GearBundle;
