"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export default function NewsLetter({
  registerModalElement,
}: {
  registerModalElement?: (el: HTMLElement | null) => void;
}) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const [hasBeenShown, setHasBeenShown] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function showOnMount() {
      if (!modalRef.current) return;
      if (pathname !== "/" || hasBeenShown) return;

      const bootstrapModule = await import("bootstrap");
      if (isCancelled || !modalRef.current) return;

      const modal = bootstrapModule.Modal.getOrCreateInstance(modalRef.current);
      modal.show();
      setHasBeenShown(true);
    }

    showOnMount();

    return () => {
      isCancelled = true;
    };
  }, [pathname, hasBeenShown]);

  return (
    <div
      ref={(el) => {
        modalRef.current = el;
        registerModalElement?.(el);
      }}
      className="modal modalCentered fade modal-newsletter auto-popup"
      id="newsletter"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="image-left">
            <Image
              loading="lazy"
              width={360}
              height={360}
              src="/assets/images/section/banner-newsletter.jpg"
              alt="Image"
            />
          </div>
          <div className="content-right">
            <span className="icon-close-popup" data-bs-dismiss="modal">
              <i className="icon-X2" />
            </span>
            <p className="h6 mb-8">Subscribe &amp; Enjoy</p>
            <p className="h1 fw-medium mb-8 text-primary">10% OFF</p>
            <p className="desc-pop">
              Join our email list &amp; be first to Receive 10% OFF your next
              order, exclusive offers &amp; more!
            </p>
            <NewsletterForm
              className="form-newsletter mb-12"
              placeholder="Your email address"
              buttonClassName="btn-action tf-btn small animate-btn"
              buttonLabel="Subscribe"
            />
            <p className="text-caption-01 cl-text-2">
              Don’t worry, we hate spam as much as you do
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
