"use client";
import Image from "next/image";

import { useState } from "react";

interface Currency {
  code: string;
  image: string;
}

interface CurrencySelectProps {
  placement?: string;
  textBlack?: boolean;
  textColor?: string;
}

const currencies: Currency[] = [
  {
    code: "USD $",
    image: "/assets/images/country/us.png",
  },
  {
    code: "VND ₫",
    image: "/assets/images/country/vn.png",
  },
];

export default function CurrencySelect({
  placement = "bottom-start",
  textBlack = false,
  textColor = "color-white",
}: CurrencySelectProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    currencies[0],
  );

  const handleSelect = (currency: Currency): void => {
    setSelectedCurrency(currency);
  };

  return (
    <div
      className={`dropdown bootstrap-select tf-dropdown-select style-default ${
        textBlack ? "" : textColor
      }  type-currencies`}
      onClick={() => {}}
    >
      <button
        type="button"
        className="btn dropdown-toggle btn-light"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        title={selectedCurrency.code}
      >
        <div className="filter-option">
          <div className="filter-option-inner">
            <div className="filter-option-inner-inner">
              <Image
                src={selectedCurrency.image}
                width={20}
                height={15}
                alt="Country"
              />
              {selectedCurrency.code}
            </div>
          </div>
        </div>
      </button>

      <div className="dropdown-menu" data-popper-placement={placement}>
        <ul className="dropdown-menu inner show">
          {currencies.map((currency) => (
            <li
              key={currency.code}
              className={
                selectedCurrency.code === currency.code ? "selected active" : ""
              }
            >
              <a
                className={`dropdown-item ${
                  selectedCurrency.code === currency.code
                    ? "active selected"
                    : ""
                }`}
                href="#"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default if needed
                  handleSelect(currency); // Call your function
                }}
              >
                <span className="text">
                  <Image
                    src={currency.image}
                    width={20}
                    height={15}
                    alt="Country"
                  />{" "}
                  {currency.code}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
