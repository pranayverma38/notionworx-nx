import Link from "next/link";
import Image from "next/image";

import { NewsletterForm } from "@/components/forms/NewsletterForm";
import CurrencySelect from "../common/CurrencySelect";
import LanguageSelect from "../common/LanguageSelect";
import FooterAccordionWrapper, {
  FooterAccordionItem,
} from "./FooterAccordionWrapper";

export default function Footer6() {
  return (
    <footer className="tf-footer">
      <div className="footer-inner flat-spacing">
        {/* <div class="br-line fake-class top-0"></div> */}
        <div className="container">
          <FooterAccordionWrapper>
            <div className="row">
              <div className="col-lg-4">
                <div className="footer-infor d-flex flex-column align-items-start mb-lg-0">
                  <Link href={`/home-decor`} className="logo-site mb-16">
                    <Image
                      loading="lazy"
                      width={150}
                      height={30}
                      src="/assets/images/logo/logo.svg"
                      alt="Image"
                    />
                  </Link>
                  <p className="lh-26 cl-text-2 mb-4">24/7 Support Center:</p>
                  <a href="tel:+0112348888" className="h4 fw-medium mb-16 link">
                    (+01) 1234 8888
                  </a>
                  <a
                    href="https://www.google.com/maps?q=600+N+Michigan+Ave+Chicago,+IL+60611+USA"
                    target="_blank"
                    className="cl-text-2 link mb-4"
                  >
                    600 N Michigan Ave, Chicago, IL 60611, USA
                  </a>
                  <a
                    href="mailto:hi.amere@gmail.com"
                    className="cl-text-2 link"
                  >
                    hi.amere@gmail.com
                  </a>
                </div>
              </div>
              <div className="col-sm-6 col-md-3 col-lg-2">
                <FooterAccordionItem
                  id="footer6-company"
                  className="footer-col-block footer-wrap-1 mx-xl-auto mb-md-0"
                  heading="COMPANY"
                  headingClassName="footer-heading footer-heading-mobile"
                >
                  <ul className="footer-menu-list">
                    <li>
                      <Link href={`/about`} className="cl-text-2 link">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href={`/our-store`} className="cl-text-2 link">
                        Our Stories
                      </Link>
                    </li>
                    <li>
                      <Link href={`/contact`} className="cl-text-2 link">
                        Contact us
                      </Link>
                    </li>
                    <li>
                      <Link href={`/blog`} className="cl-text-2 link">
                        Latest New
                      </Link>
                    </li>
                    <li>
                      <Link href={`/account-page`} className="cl-text-2 link">
                        My Account
                      </Link>
                    </li>
                  </ul>
                </FooterAccordionItem>
              </div>
              <div className="col-sm-6 col-md-3 col-lg-2">
                <FooterAccordionItem
                  id="footer6-customer"
                  className="footer-col-block footer-wrap-2 mx-xl-auto mb-md-0"
                  heading="CUSTOMER"
                  headingClassName="footer-heading footer-heading-mobile"
                >
                  <ul className="footer-menu-list">
                    <li>
                      <Link href={`/shipping`} className="cl-text-2 link">
                        Shipping
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`/return-and-refund`}
                        className="cl-text-2 link"
                      >
                        Return &amp; Refund
                      </Link>
                    </li>
                    <li>
                      <Link href={`/privacy-policy`} className="cl-text-2 link">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`/term-and-condition`}
                        className="cl-text-2 link"
                      >
                        Terms &amp; Conditions
                      </Link>
                    </li>
                    <li>
                      <Link href={`/faq`} className="cl-text-2 link">
                        Orders FAQs
                      </Link>
                    </li>
                  </ul>
                </FooterAccordionItem>
              </div>
              <div className="col-md-6 col-lg-4">
                <FooterAccordionItem
                  id="footer6-newsletter"
                  className="footer-col-block footer-wrap-3 mb-0"
                  heading="NEWSLETTER"
                  headingClassName="footer-heading footer-heading-mobile"
                >
                  <p className="footer-desc cl-text-2 mb-16">
                    Subscribe for store updates and discounts.
                  </p>
                  <NewsletterForm className="form-sub mb-16" />
                  <p className="text-remember cl-text-2">
                    By clicking subcribe, you agree to the{" "}
                    <Link
                      href={`/term-and-condition`}
                      className="text-main link link-underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href={`/privacy-policy`}
                      className="text-main link link-underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </FooterAccordionItem>
              </div>
            </div>
          </FooterAccordionWrapper>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="br-line d-none d-sm-flex" />
          <div className="inner-bottom">
            <div className="tf-list list-currenci">
              <div className="tf-currencies">
                <CurrencySelect textBlack />
              </div>
              <div className="tf-languages">
                <LanguageSelect textBlack />
              </div>
            </div>
            <p className="text-nocopy cl-text-2">
              ©2026 Amerce. All Rights Reserved.
            </p>
            <ul className="tf-list payment-list">
              <li>
                <Image
                  loading="lazy"
                  width={38}
                  height={24}
                  src="/assets/images/payment/visa.svg"
                  alt="Image"
                />
              </li>
              <li>
                <Image
                  loading="lazy"
                  width={38}
                  height={24}
                  src="/assets/images/payment/master-card.svg"
                  alt="Image"
                />
              </li>
              <li>
                <Image
                  loading="lazy"
                  width={38}
                  height={24}
                  src="/assets/images/payment/amex.svg"
                  alt="Image"
                />
              </li>
              <li>
                <Image
                  loading="lazy"
                  width={38}
                  height={24}
                  src="/assets/images/payment/paypal.svg"
                  alt="Image"
                />
              </li>
              <li>
                <Image
                  loading="lazy"
                  width={38}
                  height={24}
                  src="/assets/images/payment/water.svg"
                  alt="Image"
                />
              </li>
              <li>
                <Image
                  loading="lazy"
                  width={38}
                  height={24}
                  src="/assets/images/payment/discover.svg"
                  alt="Image"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
