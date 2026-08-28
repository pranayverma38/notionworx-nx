import Link from "next/link";
import Image from "next/image";

import { NewsletterForm } from "@/components/forms/NewsletterForm";
import FooterAccordionWrapper, {
  FooterAccordionItem,
} from "./FooterAccordionWrapper";

type Footer1Props = {
  hideTopRule?: boolean;
};

export default function Footer1({ hideTopRule = false }: Footer1Props) {
  return (
    <footer className="tf-footer">
      <div className="footer-inner flat-spacing position-relative">
        {!hideTopRule ? <div className="br-line fake-class top-0" /> : null}
        <div className="container">
          <FooterAccordionWrapper>
            <div className="row">
              <div className="col-md-6 col-lg-4">
                <div className="footer-infor d-flex flex-column align-items-start mb-lg-0">
                  <Link
                    href="/"
                    className="logo-site d-inline-flex align-items-center mb-16"
                    style={{ width: "min(100%, 220px)" }}
                  >
                    <Image
                      loading="lazy"
                      width={500}
                      height={212}
                      src="/assets/images/logo/Notion_Worx_LOGO_3D_no_lights.webp"
                      alt="Notion Worx"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </Link>
                  <p className="lh-26 cl-text-2 mb-16">
                    Custom canopies, displays, flags, apparel, and event
                    essentials now powered by the local Notion Worx inventory and
                    mirrored product imagery.
                  </p>
                  <Link
                    href="/contact"
                    className="text-decoration-underline text-primary lh-26 mb-12"
                  >
                    Request a quote
                  </Link>
                  <Link href="/collection" className="cl-text-2 link mb-8">
                    Browse collections
                  </Link>
                  <Link href="/shop-default" className="cl-text-2 link">
                    Shop all products
                  </Link>
                </div>
              </div>

              <div className="col-sm-6 col-md-6 col-lg-2">
                <FooterAccordionItem
                  id="footer1-shop"
                  className="footer-col-block footer-wrap-1 mx-xl-auto"
                  heading="SHOP"
                  headingClassName="footer-heading footer-heading-mobile"
                >
                  <ul className="footer-menu-list">
                    <li>
                      <Link href="/shop-default" className="cl-text-2 link">
                        All Products
                      </Link>
                    </li>
                    <li>
                      <Link href="/collection" className="cl-text-2 link">
                        Collections
                      </Link>
                    </li>
                    <li>
                      <Link href="/search-result" className="cl-text-2 link">
                        Search Catalog
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="cl-text-2 link">
                        Request Support
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="cl-text-2 link">
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                </FooterAccordionItem>
              </div>

              <div className="col-sm-6 col-md-6 col-lg-2">
                <FooterAccordionItem
                  id="footer1-account"
                  className="footer-col-block footer-wrap-2 mx-xl-auto"
                  heading="ACCOUNT"
                  headingClassName="footer-heading footer-heading-mobile"
                >
                  <ul className="footer-menu-list">
                    <li>
                      <Link href="/login" className="cl-text-2 link">
                        Login / Register
                      </Link>
                    </li>
                    <li>
                      <Link href="/view-cart" className="cl-text-2 link">
                        View Cart
                      </Link>
                    </li>
                    <li>
                      <Link href="/track-order" className="cl-text-2 link">
                        Track Order
                      </Link>
                    </li>
                    <li>
                      <Link href="/account-page" className="cl-text-2 link">
                        My Account
                      </Link>
                    </li>
                  </ul>
                </FooterAccordionItem>
              </div>

              <div className="col-md-6 col-lg-4">
                <FooterAccordionItem
                  id="footer1-newsletter"
                  className="footer-col-block footer-wrap-3 mb-0"
                  heading="NEWSLETTER"
                  headingClassName="footer-heading footer-heading-mobile"
                >
                  <p className="footer-desc cl-text-2">
                    Subscribe for new collection drops, product updates, and
                    project-ready merchandising ideas.
                  </p>
                  <NewsletterForm />
                  <p className="text-remember cl-text-2">
                    Subscribe only if you want future Notion Worx catalog
                    updates. You can unsubscribe any time.
                  </p>
                </FooterAccordionItem>
              </div>
            </div>
          </FooterAccordionWrapper>
        </div>
      </div>
    </footer>
  );
}
