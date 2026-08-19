"use client";

import { useState } from "react";

interface LanguageSelectProps {
  placement?: string;
  textBlack?: boolean;
  textColor?: string;
}

const languages: string[] = ["English", "العربية", "简体中文", "اردو"];

export default function LanguageSelect({
  placement = "bottom-start",
  textBlack = false,
  textColor = "color-white",
}: LanguageSelectProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    languages[0],
  );

  const handleSelect = (lang: string): void => {
    setSelectedLanguage(lang);
  };

  return (
    <div
      className={`dropdown bootstrap-select tf-dropdown-select style-default ${
        textBlack ? "" : textColor
      } type-languages`}
    >
      <button
        type="button"
        className="btn dropdown-toggle btn-light"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        title={selectedLanguage}
      >
        <div className="filter-option">
          <div className="filter-option-inner">
            <div className="filter-option-inner-inner">{selectedLanguage}</div>
          </div>
        </div>
      </button>

      <div className="dropdown-menu" data-popper-placement={placement}>
        <ul className="dropdown-menu inner show" role="presentation">
          {languages.map((lang, index) => (
            <li
              key={index}
              className={selectedLanguage === lang ? "selected active" : ""}
            >
              <a
                role="option"
                aria-selected={selectedLanguage === lang}
                className={`dropdown-item ${
                  selectedLanguage === lang ? "active selected" : ""
                }`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleSelect(lang);
                }}
              >
                <span className="text">{lang}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
