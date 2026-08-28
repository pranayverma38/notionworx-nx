"use client";

import { useState } from "react";

interface LanguageSelectProps {
  placement?: string;
  textBlack?: boolean;
  textColor?: string;
}

type LanguageOption = {
  label: string;
  code: "en" | "es";
};

const GOOGLE_TRANSLATE_COOKIE_NAME = "googtrans";
const DEFAULT_LANGUAGE_CODE: LanguageOption["code"] = "en";
const languages: LanguageOption[] = [
  { label: "English", code: "en" },
  { label: "Español", code: "es" },
];

function getTranslateCookieValue(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookiePrefix = `${GOOGLE_TRANSLATE_COOKIE_NAME}=`;
  const cookie = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(cookiePrefix));

  return cookie ? decodeURIComponent(cookie.slice(cookiePrefix.length)) : null;
}

function getCurrentLanguageCode(): LanguageOption["code"] {
  const cookieValue = getTranslateCookieValue();
  const cookieLanguage = cookieValue?.split("/").pop();

  if (cookieLanguage === "es") {
    return "es";
  }

  return DEFAULT_LANGUAGE_CODE;
}

function persistTranslateCookie(value: string): void {
  if (typeof document === "undefined") {
    return;
  }

  const encodedValue = encodeURIComponent(value);
  const cookieValue = `${GOOGLE_TRANSLATE_COOKIE_NAME}=${encodedValue};path=/;max-age=31536000`;

  document.cookie = cookieValue;

  if (window.location.hostname.includes(".")) {
    document.cookie = `${cookieValue};domain=.${window.location.hostname}`;
  }
}

export default function LanguageSelect({
  placement = "bottom-start",
  textBlack = false,
  textColor = "color-white",
}: LanguageSelectProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(
    () =>
      languages.find((language) => language.code === getCurrentLanguageCode()) ??
      languages[0],
  );

  const handleSelect = (language: LanguageOption): void => {
    setSelectedLanguage(language);
    persistTranslateCookie(`/en/${language.code}`);
    window.location.reload();
  };

  return (
    <div
      translate="no"
      className={`dropdown bootstrap-select tf-dropdown-select style-default ${
        textBlack ? "" : textColor
      } type-languages notranslate`}
    >
      <button
        type="button"
        className="btn dropdown-toggle btn-light"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        title={selectedLanguage.label}
      >
        <div className="filter-option">
          <div className="filter-option-inner">
            <div className="filter-option-inner-inner">
              {selectedLanguage.label}
            </div>
          </div>
        </div>
      </button>

      <div className="dropdown-menu" data-popper-placement={placement}>
        <ul className="dropdown-menu inner show" role="presentation">
          {languages.map((language) => (
            <li
              key={language.code}
              className={
                selectedLanguage.code === language.code ? "selected active" : ""
              }
            >
              <a
                role="option"
                aria-selected={selectedLanguage.code === language.code}
                className={`dropdown-item ${
                  selectedLanguage.code === language.code
                    ? "active selected"
                    : ""
                }`}
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  handleSelect(language);
                }}
              >
                <span className="text">{language.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
