"use client";

import Link from "next/link";
import Image from "next/image";
import { useContextElement } from "@/context/Context";
import { formatPrice } from "@/utils/formatPrice";

function Compare() {
  const { compareItem, removeFromCompareItem, addProductToCart } =
    useContextElement();

  if (!compareItem || compareItem.length === 0) {
    return (
      <div className="flat-spacing">
        <div className="container text-center py-5">
          <h3>Your comparison list is empty</h3>
          <p className="mb-4">
            You haven&apos;t added any products to compare yet.
          </p>
          <Link href="/shop-default" className="tf-btn btn-primary">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flat-spacing">
        <div className="container">
          <div className="tf-table-compare">
            <table>
              <thead>
                <tr className="compare-row">
                  <th className="compare-col" />
                  {compareItem.map((product) => (
                    <th
                      key={product.id}
                      className="compare-col compare-head"
                    >
                      <div className="compare-item text-center">
                        <div className="item_image">
                          <Image
                            loading="lazy"
                            width={276}
                            height={356}
                            src={product.img || "/assets/images/product/product-1.jpg"}
                            alt={product.name}
                          />
                          <button
                            type="button"
                            className="remove border-0 bg-transparent p-0"
                            aria-label="Remove from compare"
                            onClick={() => removeFromCompareItem(product.id)}
                          >
                            <i className="icon-X2" />
                          </button>
                        </div>
                        <Link
                          href={`/product-detail/${product.id}`}
                          className="item_name fw-medium lh-24 link"
                        >
                          {product.name}
                        </Link>
                        <p className="item_type text-caption-01 cl-text-2">
                          {product.category || "General"}
                        </p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="compare-row">
                  <td className="compare-col compare-title">Rating</td>
                  {compareItem.map((product) => (
                    <td key={product.id} className="compare-col">
                      <div className="compare_rate">
                        <div className="star-wrap normal d-flex align-items-center">
                          <i className="icon icon-Star" />
                          <i className="icon icon-Star" />
                          <i className="icon icon-Star" />
                          <i className="icon icon-Star" />
                          <i className="icon icon-Star cl-text-line" />
                        </div>
                        <span className="rate_count">
                          {" "}
                          {product.reviewsText || "(0)"}{" "}
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="compare-row">
                  <td className="compare-col compare-title">Price</td>
                  {compareItem.map((product) => (
                    <td key={product.id} className="compare-col compare-value">
                      <span>{formatPrice(product.price)}</span>
                    </td>
                  ))}
                </tr>
                <tr className="compare-row">
                  <td className="compare-col compare-title">SKU</td>
                  {compareItem.map((product) => (
                    <td key={product.id} className="compare-col compare-value">
                      <span>{product.sku || "N/A"}</span>
                    </td>
                  ))}
                </tr>
                <tr className="compare-row">
                  <td className="compare-col compare-title">Size</td>
                  {compareItem.map((product) => (
                    <td key={product.id} className="compare-col compare-value">
                      <span>
                        {product.sizes && product.sizes.length > 0
                          ? product.sizes.join(", ")
                          : "N/A"}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="compare-row">
                  <td className="compare-col compare-title">Color</td>
                  {compareItem.map((product) => (
                    <td key={product.id} className="compare-col compare-value">
                      <div className="list-compare-color justify-content-center">
                        {product.colors && product.colors.length > 0 ? (
                          product.colors.map((color, idx) => (
                            <span
                              key={idx}
                              className={`item ${color.swatchClass}`}
                              title={color.label}
                            />
                          ))
                        ) : (
                          <span>N/A</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="compare-row">
                  <td className="compare-col compare-title">Add To Cart</td>
                  {compareItem.map((product) => (
                    <td key={product.id} className="compare-col compare-value">
                      <button
                        className="tf-btn s-small animate-btn"
                        onClick={() => addProductToCart(product)}
                      >
                        <span className="text-caption-01"> Add To Cart </span>
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Compare;
