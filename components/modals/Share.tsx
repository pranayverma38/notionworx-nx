"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const COPIED_RESET_MS = 2000;

const noopSubscribe = () => () => {};

function readOrigin(): string {
  return typeof window !== "undefined" ? window.location.origin : "";
}

export default function Share({
  registerModalElement,
}: {
  registerModalElement?: (el: HTMLElement | null) => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const origin = useSyncExternalStore(noopSubscribe, readOrigin, () => "");

  const query = searchParams.toString();
  const pageUrl =
    origin === ""
      ? ""
      : `${origin}${pathname}${query ? `?${query}` : ""}`;

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setCopied(false));
  }, [pageUrl]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), COPIED_RESET_MS);
    return () => clearTimeout(t);
  }, [copied]);

  const handleCopy = useCallback(async () => {
    if (!pageUrl) return;
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
    } catch {
      /* clipboard API unavailable (e.g. non-secure context) */
    }
  }, [pageUrl]);

  return (
    <div
      ref={registerModalElement}
      className="modal modalCentered fade modal-share"
      id="share"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-heading d-flex align-items-center justify-content-between">
            <h4 className="title-pop">Share</h4>
            <span className="cs-pointer d-flex link" data-bs-dismiss="modal">
              <i className="icon-X2 fs-24" />
            </span>
          </div>
          <div className="modal-main">
            <ul className="tf-social-icon-2 hv-dark mb-20">
              <li>
                <a href="https://www.facebook.com/">
                  <i className="icon icon-FacebookLogo" />
                </a>
              </li>
              <li>
                <a href="https://x.com/">
                  <i className="icon icon-XLogo" />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/">
                  <i className="icon icon-InstagramLogo" />
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/">
                  <i className="icon icon-TiktokLogo" />
                </a>
              </li>
            </ul>
            <div className="wrap-code btn-coppy-text">
              <p className="coppyText cl-text-2">{pageUrl || "…"}</p>
              <button
                type="button"
                className="btn-action-copy tf-btn"
                onClick={handleCopy}
                aria-live="polite"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
