"use client";

import { type FormEvent, useMemo, useState } from "react";

import {
  ESTIMATE_SHIPPING_COUNTRIES,
  validateEstimateShippingZipcode,
} from "@/utils/estimateShipping";

type CartTool = "note" | "shipping" | "coupon" | null;

type MiniCartToolsProps = {
  activeTool: CartTool;
  setActiveTool: (tool: CartTool) => void;
};

export function MiniCartToolButtons({
  activeTool,
  setActiveTool,
}: MiniCartToolsProps) {
  return (
    <div className="tf-mini-cart-tool">
      <button
        type="button"
        className={`tf-mini-cart-tool-btn btn-add-note ${activeTool === "note" ? "open" : ""}`}
        onClick={() => setActiveTool(activeTool === "note" ? null : "note")}
      >
        <i className="icon icon-NotePencil" />
        <div className="lh-24">Note</div>
      </button>
      <button
        type="button"
        className={`tf-mini-cart-tool-btn btn-estimate-shipping ${activeTool === "shipping" ? "open" : ""}`}
        onClick={() =>
          setActiveTool(activeTool === "shipping" ? null : "shipping")
        }
      >
        <i className="icon icon-Truck" />
        <div className="lh-24">Shipping</div>
      </button>
      <button
        type="button"
        className={`tf-mini-cart-tool-btn btn-add-gift ${activeTool === "coupon" ? "open" : ""}`}
        onClick={() => setActiveTool(activeTool === "coupon" ? null : "coupon")}
      >
        <i className="icon icon-SealPercent" />
        <div className="lh-24">Coupon</div>
      </button>
    </div>
  );
}

export function MiniCartToolPanels({
  activeTool,
  setActiveTool,
}: MiniCartToolsProps) {
  const close = () => setActiveTool(null);
  const [selectedCountry, setSelectedCountry] = useState(
    ESTIMATE_SHIPPING_COUNTRIES[0].value,
  );
  const [selectedProvince, setSelectedProvince] = useState(
    () => ESTIMATE_SHIPPING_COUNTRIES[0].provinces[0] ?? "",
  );
  const [zipcode, setZipcode] = useState("");
  const [zipFeedback, setZipFeedback] = useState<"none" | "error" | "success">(
    "none",
  );

  const provinces = useMemo(() => {
    return (
      ESTIMATE_SHIPPING_COUNTRIES.find(
        (country) => country.value === selectedCountry,
      )?.provinces ?? []
    );
  }, [selectedCountry]);

  const handleCountryChange = (countryValue: string) => {
    setSelectedCountry(countryValue);
    const nextProvinces =
      ESTIMATE_SHIPPING_COUNTRIES.find(
        (country) => country.value === countryValue,
      )?.provinces ?? [];
    setSelectedProvince(nextProvinces[0] ?? "");
    setZipFeedback("none");
  };

  const handleShippingSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = zipcode.trim();
    if (!validateEstimateShippingZipcode(trimmed)) {
      setZipFeedback("error");
      return;
    }
    setZipFeedback("success");
  };

  return (
    <>
      <div
        className={`tf-mini-cart-tool-openable add-note ${activeTool === "note" ? "open" : ""}`}
      >
        <button
          type="button"
          className="overlay tf-mini-cart-tool-close"
          onClick={close}
        />
        <form
          className="tf-mini-cart-tool-content"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label
            htmlFor="cart-note"
            className="tf-mini-cart-tool-text h6 fw-medium"
          >
            <i className="icon icon-NotePencil" />
            Note
          </label>
          <textarea
            name="note"
            id="cart-note"
            placeholder="Note about your order"
            defaultValue=""
          />
          <div className="tf-cart-tool-btns">
            <button
              className="subscribe-button tf-btn animate-btn"
              type="submit"
            >
              Save
            </button>
            <button
              type="button"
              className="tf-btn btn-stroke tf-mini-cart-tool-close"
              onClick={close}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div
        className={`tf-mini-cart-tool-openable estimate-shipping ${activeTool === "shipping" ? "open" : ""}`}
      >
        <button
          type="button"
          className="overlay tf-mini-cart-tool-close"
          onClick={close}
        />
        <form
          id="shipping-form"
          className="tf-mini-cart-tool-content"
          onSubmit={handleShippingSubmit}
        >
          <div className="tf-mini-cart-tool-text h6 fw-medium">
            <i className="icon icon-Truck" />
            Shipping
          </div>
          <div className="form-content gap-10">
            <div className="tf-select">
              <select
                className="w-100"
                id="shipping-country-form"
                name="address[country]"
                data-default=""
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
              >
                {ESTIMATE_SHIPPING_COUNTRIES.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="tf-select">
              <select
                id="shipping-province-form"
                name="address[province]"
                data-default=""
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
              >
                {provinces.length > 0 ? (
                  provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))
                ) : (
                  <option value="">----</option>
                )}
              </select>
            </div>
            <input
              type="text"
              placeholder="Postal code"
              data-opend-focus=""
              id="zipcode"
              name="address[zip]"
              value={zipcode}
              onChange={(e) => {
                setZipcode(e.target.value);
                if (zipFeedback !== "none") setZipFeedback("none");
              }}
              autoComplete="postal-code"
            />
            {zipFeedback === "error" ? (
              <div id="zipcode-message" className="error text-caption-01 mt-4" role="alert">
                Enter a postal code.
              </div>
            ) : null}
            {zipFeedback === "success" ? (
              <div id="zipcode-success" className="success mt-4" role="status">
                <p className="mb-0">
                  We found one shipping rate available for your address:
                </p>
                <p className="standard mb-0 fw-medium">
                  Standard at <span>$0.00</span> USD
                </p>
              </div>
            ) : null}
          </div>
          <div className="tf-cart-tool-btns">
            <button
              className="subscribe-button tf-btn animate-btn"
              type="submit"
            >
              Save
            </button>
            <button
              type="button"
              className="tf-btn btn-stroke tf-mini-cart-tool-close"
              onClick={close}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div
        className={`tf-mini-cart-tool-openable add-gift ${activeTool === "coupon" ? "open" : ""}`}
      >
        <button
          type="button"
          className="overlay tf-mini-cart-tool-close"
          onClick={close}
        />
        <form
          className="tf-mini-cart-tool-content"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="tf-mini-cart-tool-text h6 fw-medium">
            <i className="icon icon-SealPercent" />
            Coupon
          </div>
          <div className="wrap">
            <h5>
              Only <span className="text-primary">$2</span>
              for a gift box
            </h5>
          </div>
          <div className="tf-cart-tool-btns">
            <button
              className="subscribe-button tf-btn animate-btn"
              type="submit"
            >
              Add a gift
            </button>
            <button
              type="button"
              className="tf-btn btn-stroke line tf-mini-cart-tool-close"
              onClick={close}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
