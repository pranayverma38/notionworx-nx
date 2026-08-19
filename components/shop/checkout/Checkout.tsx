"use client";

import Link from "next/link";
import Image from "next/image";
import { type FormEvent, useMemo, useState } from "react";

import CountdownTimer from "@/components/common/Countdown";
import { PasswordField } from "@/components/forms/PasswordField";
import { useContextElement, type CartProduct } from "@/context/Context";
import type { ProductId } from "@/context/store";
import { formatPrice } from "@/utils/formatPrice";
import {
  ESTIMATE_SHIPPING_COUNTRIES,
  validateEstimateShippingZipcode,
} from "@/utils/estimateShipping";

export default function Checkout() {
  const { cartProducts, setCartProducts, updateQuantity, totalPrice } =
    useContextElement();
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingCountry, setShippingCountry] = useState("");
  const [shippingProvince, setShippingProvince] = useState("");
  const [shippingZip, setShippingZip] = useState("");
  const [shippingZipError, setShippingZipError] = useState(false);

  const shippingProvinces = useMemo(
    () =>
      ESTIMATE_SHIPPING_COUNTRIES.find((c) => c.value === shippingCountry)
        ?.provinces ?? [],
    [shippingCountry],
  );

  const discount = 0;
  const orderTotal = Math.max(0, totalPrice - discount + shippingCost);

  const handleShippingCountryChange = (value: string) => {
    setShippingCountry(value);
    const next =
      ESTIMATE_SHIPPING_COUNTRIES.find((c) => c.value === value)?.provinces ??
      [];
    setShippingProvince(next[0] ?? "");
    setShippingZipError(false);
  };

  const handleCheckoutSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const zip = shippingZip.trim();
    if (!validateEstimateShippingZipcode(zip)) {
      setShippingZipError(true);
      return;
    }
    setShippingZipError(false);
  };

  const removeLine = (id: ProductId) => {
    setCartProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const setQty = (id: ProductId, qty: number) => {
    if (qty < 1) {
      removeLine(id);
      return;
    }
    updateQuantity(id, qty);
  };

  return (
    <section className="section-checkout flat-spacing-2">
      {cartProducts.length > 0 ? (
        <div className="flat-spacing-2 pt-0">
          <div className="container">
            <div className="tf-cart-notification">
              <div className="count-text">
                <div className="ic">🔥</div>
                <div className="">
                  Your cart will expire in
                  <div className="js-countdown time-count cd-has-zero cd-no">
                    <CountdownTimer style={4} />
                  </div>
                  minutes! Please checkout now before your items sell out!
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div className="container">
        <div className="row">
          <div className="col-lg-7 ">
            <div className="tf-page-checkout mb-lg-0">
              <div className="wrap-quick-login">
                <p className="title cl-text-2">
                  Already have an account?
                  <a
                    href="#sign"
                    data-bs-toggle="modal"
                    className="tf-btn-line-2 style-primary fw-semibold "
                  >
                    Login Here
                  </a>
                </p>
                <form
                  className="form-quick-login"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="tf-grid-layout sm-col-2">
                    <input type="text" placeholder="Your name/Email" required />
                    <PasswordField
                      id="checkout-quick-login-password"
                      placeholder="Password"
                      required
                    />
                  </div>
                  <button
                    className="action tf-btn animate-btn small fw-semibold"
                    type="submit"
                  >
                    Login
                  </button>
                </form>
              </div>
              <form
                className="tf-checkout-cart-main"
                onSubmit={handleCheckoutSubmit}
              >
                <div className="box-ip-checkout estimate-shipping">
                  <div className="h5 title">Information</div>
                  <div className="form-content">
                    <div className="tf-grid-layout sm-col-2">
                      <input type="text" placeholder="First Name*" required />
                      <input type="text" placeholder="Last Name*" required />
                    </div>
                    <div className="tf-grid-layout sm-col-2">
                      <input
                        type="email"
                        placeholder="Email Address*"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Phone Number*"
                        required
                      />
                    </div>
                    <fieldset>
                      <div className="tf-select">
                        <select
                          className="w-100"
                          id="shipping-country-form"
                          name="address[country]"
                          data-default=""
                          required
                          value={shippingCountry}
                          onChange={(e) =>
                            handleShippingCountryChange(e.target.value)
                          }
                        >
                          <option value=""> Choose Country / Region</option>
                          {ESTIMATE_SHIPPING_COUNTRIES.map((country) => (
                            <option key={country.value} value={country.value}>
                              {country.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </fieldset>
                    <div className="tf-grid-layout sm-col-2">
                      <input type="text" placeholder="Town/City*" required />
                      <input type="text" placeholder="Street,..." required />
                    </div>
                    <div className="tf-grid-layout sm-col-2">
                      <div className="tf-select">
                        <select
                          id="shipping-province-form"
                          name="address[province]"
                          data-default=""
                          value={shippingProvince}
                          onChange={(e) =>
                            setShippingProvince(e.target.value)
                          }
                          disabled={!shippingCountry}
                        >
                          {!shippingCountry ? (
                            <option value="">Choose State</option>
                          ) : shippingProvinces.length > 0 ? (
                            shippingProvinces.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))
                          ) : (
                            <option value="">------</option>
                          )}
                        </select>
                      </div>
                      <div>
                        <input
                          type="text"
                          inputMode="text"
                          placeholder="Postal Code*"
                          name="address[zip]"
                          id="checkout-postal-code"
                          required
                          value={shippingZip}
                          onChange={(e) => {
                            setShippingZip(e.target.value);
                            if (shippingZipError) setShippingZipError(false);
                          }}
                          autoComplete="postal-code"
                          aria-invalid={shippingZipError}
                        />
                        {shippingZipError ? (
                          <div className="error text-caption-01 mt-4" role="alert">
                            Enter a postal code.
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <fieldset className="d-grid">
                      <textarea placeholder="Write note..." defaultValue={""} />
                    </fieldset>
                  </div>
                </div>
                <div className="box-ip-payment">
                  <h5 className="title">Choose Payment Option:</h5>
                  <div className="payment-method-box" id="payment-method-box">
                    <div className="payment_accordion type-2">
                      <label
                        htmlFor="credit-card"
                        className="payment_check checkbox-wrap collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#credit-card-payment"
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          className="tf-check-rounded style-2"
                          id="credit-card"
                          defaultChecked={true}
                        />
                        <span className="pay-title fw-medium lh-24">
                          Credit card
                        </span>
                      </label>
                      <div
                        id="credit-card-payment"
                        className="collapse"
                        data-bs-parent="#payment-method-box"
                      >
                        <div className="payment_body form-content">
                          <p className="text-payment cl-text-2">
                            Make your payment directly into our bank account.
                            Your order will not be shipped until the funds have
                            cleared in our account.
                          </p>
                          <fieldset>
                            <input type="text" placeholder="Name On Card*" />
                          </fieldset>
                          <fieldset className="ip-card">
                            <input type="number" placeholder="Card Numbers*" />
                            <div className="card-logo d-none d-sm-flex">
                              <Image
                                width={38}
                                height={24}
                                src="/assets/images/payment/visa.svg"
                                alt="Payment Logo"
                              />
                              <Image
                                width={38}
                                height={24}
                                src="/assets/images/payment/master-card.svg"
                                alt="Payment Logo"
                              />
                              <Image
                                width={38}
                                height={24}
                                src="/assets/images/payment/amex.svg"
                                alt="Payment Logo"
                              />
                              <Image
                                width={38}
                                height={24}
                                src="/assets/images/payment/paypal.svg"
                                alt="Payment Logo"
                              />
                              <Image
                                width={38}
                                height={24}
                                src="/assets/images/payment/water.svg"
                                alt="Payment Logo"
                              />
                              <Image
                                width={38}
                                height={24}
                                src="/assets/images/payment/discover.svg"
                                alt="Payment Logo"
                              />
                            </div>
                          </fieldset>
                          <div className="tf-grid-layout sm-col-2">
                            <input type="date" />
                            <input type="number" placeholder="CVV*" />
                          </div>
                          <div className="checkbox-wrap">
                            <input
                              id="save"
                              type="checkbox"
                              className="tf-check style-2"
                            />
                            <label htmlFor="save" className="fw-medium lh-24">
                              Save Card Details
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment_accordion">
                      <label
                        htmlFor="cash-on"
                        className="payment_check checkbox-wrap collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#cash-on-payment"
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          className="tf-check-rounded style-2"
                          id="cash-on"
                        />
                        <span className="pay-title fw-medium">
                          Cash On Delivery
                        </span>
                      </label>
                      <div
                        id="cash-on-payment"
                        className="collapse"
                        data-bs-parent="#payment-method-box"
                      />
                    </div>
                    <div className="payment_accordion">
                      <label
                        htmlFor="apple"
                        className="payment_check checkbox-wrap"
                        data-bs-toggle="collapse"
                        data-bs-target="apple-payment"
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          className="tf-check-rounded style-2"
                          id="apple"
                        />
                        <svg
                          width={13}
                          height={17}
                          viewBox="0 0 13 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6.40781 3.71076C7.30791 3.78688 8.20801 3.25405 8.77057 2.5785C9.32376 1.88392 9.68943 0.951477 9.59567 0C8.7987 0.0380591 7.81422 0.532827 7.25165 1.2274C6.73597 1.82684 6.29529 2.79734 6.40781 3.71076ZM7.48524 4.36638C8.06968 4.13349 8.79323 3.84517 9.5862 3.89149C10.0925 3.92955 11.5552 4.08178 12.4928 5.48997C12.4885 5.49324 12.479 5.49952 12.4648 5.50884C12.2329 5.66192 10.7593 6.63438 10.777 8.55372C10.7946 10.8404 12.6301 11.6931 12.8703 11.8047C12.8859 11.812 12.8948 11.8161 12.896 11.8173C12.8949 11.8204 12.8931 11.8265 12.8903 11.8355C12.8424 11.9928 12.5267 13.0293 11.8083 14.0913C11.1426 15.0808 10.4582 16.0513 9.37055 16.0704C8.85873 16.0797 8.51395 15.9284 8.15493 15.771C7.77735 15.6054 7.38401 15.4329 6.76401 15.4329C6.12175 15.4329 5.71042 15.61 5.31447 15.7805C4.97054 15.9286 4.63821 16.0717 4.17622 16.0894C3.1261 16.1275 2.32914 15.0428 1.66344 14.0532C0.30391 12.0552 -0.736832 8.42051 0.669576 5.9657C1.35403 4.7383 2.60104 3.9676 3.94182 3.94858C4.52677 3.93778 5.08457 4.16266 5.57247 4.35935C5.94482 4.50946 6.27645 4.64315 6.54836 4.64315C6.79066 4.64315 7.10915 4.51624 7.48524 4.36638Z"
                            fill="#101010"
                          />
                        </svg>
                        <span className="pay-title fw-medium">Apple Pay</span>
                      </label>
                      <div
                        id="apple-payment"
                        className="collapse"
                        data-bs-parent="#payment-method-box"
                      />
                    </div>
                    <div className="payment_accordion">
                      <label
                        htmlFor="paypal"
                        className="payment_check checkbox-wrap collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#paypal-payment"
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          className="tf-check-rounded style-2"
                          id="paypal"
                        />
                        <span className="pay-title fw-medium">
                          <Image
                            loading="lazy"
                            width={60}
                            height={15}
                            src="/assets/images/payment/paypal-2.svg"
                            alt="PayPal"
                          />
                        </span>
                      </label>
                      <div
                        id="paypal-payment"
                        className="collapse"
                        data-bs-parent="#payment-method-box"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="tf-btn animate-btn w-100"
                  disabled={cartProducts.length === 0}
                >
                  Pay Now
                </button>
              </form>
            </div>
          </div>
          <div className="col-lg-5 ">
            <div className="fl-sidebar-cart type-2 mt-lg-0 sticky-top">
              <div className="box-your-order">
                <h5 className="title">Shopping Cart</h5>
                <ul className="list-order-product">
                  {cartProducts.length === 0 ? (
                    <li className="order-item fw-medium">
                      <div className="infor-prd">
                        <div className="prd_name fw-medium lh-24">
                          Your cart is empty
                        </div>
                      </div>
                    </li>
                  ) : (
                    cartProducts.map((item) => (
                      <CheckoutOrderItem
                        key={item.id}
                        item={item}
                        onRemove={() => removeLine(item.id)}
                        onQtyChange={(qty) => setQty(item.id, qty)}
                      />
                    ))
                  )}
                </ul>
                <form
                  className="ip-discount-code"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="text"
                    placeholder="Add voucher discount"
                    required
                  />
                  <button className="action tf-btn animate-btn" type="submit">
                    Apply Code
                  </button>
                </form>
                <ul className="list-total">
                  <li className="total-item lh-24 fw-medium">
                    <span>Shipping</span>
                    <span>
                      <select
                        value={shippingCost}
                        onChange={(e) => setShippingCost(Number(e.target.value))}
                      >
                        <option value={0}>Free</option>
                        <option value={35}>Local: {formatPrice(35)}</option>
                        <option value={35}>Flat Rate: {formatPrice(35)}</option>
                      </select>
                    </span>
                  </li>
                  <li className="total-item lh-24 fw-medium">
                    <span>Discounts</span>
                    <span>{formatPrice(discount)}</span>
                  </li>
                </ul>
                <div className="last-total h5 fw-medium">
                  <span>Total</span>
                  <span>{formatPrice(orderTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckoutOrderItem({
  item,
  onRemove,
  onQtyChange,
}: {
  item: CartProduct;
  onRemove: () => void;
  onQtyChange: (qty: number) => void;
}) {
  const imgSrc =
    item.img ?? item.images?.[0]?.src ?? "/assets/images/product/product-1.jpg";
  const colorLabel = item.selectedColor ?? item.colors?.[0]?.label ?? null;
  const sizeLabel = item.selectedSize ?? null;
  const lineTotal = item.price * item.quantity;

  return (
    <li className="order-item fw-medium">
      <Link href={`/product-detail/${item.id}`} className="img-prd">
        <Image loading="lazy" width={100} height={133} src={imgSrc} alt="" />
      </Link>
      <div className="infor-prd">
        <Link
          href={`/product-detail/${item.id}`}
          className="prd_name fw-medium lh-24 link link-underline"
        >
          {item.name}
        </Link>
        {colorLabel ? (
          <div className="text-caption-01">
            <span className="cl-text-2">Color:</span> {colorLabel}
          </div>
        ) : null}
        {sizeLabel ? (
          <div className="text-caption-01">
            <span className="cl-text-2">Size:</span> {sizeLabel}
          </div>
        ) : null}
        <div className="wg-quantity mt-8">
          <button
            type="button"
            className="btn-quantity minus-quantity"
            onClick={() => onQtyChange(item.quantity - 1)}
          >
            <i className="icon icon-minus" />
          </button>
          <input className="quantity-product" readOnly value={item.quantity} />
          <button
            type="button"
            className="btn-quantity plus-quantity"
            onClick={() => onQtyChange(item.quantity + 1)}
          >
            <i className="icon icon-plus" />
          </button>
        </div>
        <button
          type="button"
          className="cart_remove tf-btn-line-3 type-primary remove border-0 bg-transparent p-0 mt-8"
          onClick={onRemove}
        >
          <span className="text-caption-01 fw-semibold">Remove</span>
        </button>
      </div>
      <div className="quantity-price text-primary">{formatPrice(lineTotal)}</div>
    </li>
  );
}
