"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement?: new (
          options: Record<string, string | boolean>,
          elementId: string,
        ) => unknown;
      };
    };
  }
}

export default function GoogleTranslateProvider() {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      const translateRoot = document.getElementById("google_translate_element");

      if (
        !translateRoot ||
        translateRoot.childElementCount > 0 ||
        !window.google?.translate?.TranslateElement
      ) {
        return;
      }

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,es",
          autoDisplay: false,
        },
        "google_translate_element",
      );
    };

    return () => {
      delete window.googleTranslateElementInit;
    };
  }, []);

  return (
    <>
      <div
        id="google_translate_element"
        className="google-translate-element"
        aria-hidden="true"
      />
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}
