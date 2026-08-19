import Link from "next/link";
import Image from "next/image";

import { NewsletterForm } from "@/components/forms/NewsletterForm";
import FooterAccordionWrapper, {
  FooterAccordionItem,
} from "./FooterAccordionWrapper";

export default function Footer4() {
  return (
    <footer className="tf-footer footer-s5 type-2 bg-dark">
      <div className="position-relative">
        <div className="br-line fake-class top-0 bg-white_10" />
        <div className="br-line fake-class bottom-0 bg-white_10 d-none d-sm-flex" />
        <div className="container-full">
          <FooterAccordionWrapper>
            <div className="footer-inner flat-spacing">
              <div className="col-left">
                <FooterAccordionItem
                  id="footer4-store"
                  className="footer-col-block type-white footer-wrap-start"
                  heading="OUR STORE"
                  headingClassName="footer-heading footer-heading-mobile text-white"
                >
                  <p className="cl-text-3 mb-4">24/7 Support Center:</p>
                  <a
                    href="tel:0112348888"
                    className="text-white link h4 fw-medium mb-12"
                  >
                    (+01) 1234 8888
                  </a>
                  <a
                    href="https://www.google.com/maps?q=600+N+Michigan+Ave+Chicago,+IL+60611+USA"
                    target="_blank"
                    className="cl-text-3 link mb-4"
                  >
                    600 N Michigan Ave, Chicago, IL 60611, USA
                  </a>
                  <a
                    href="mailto:hi.amere@gmail.com"
                    className="cl-text-3 link"
                  >
                    hi.amere@gmail.com
                  </a>
                </FooterAccordionItem>
              </div>
              <div className="br-line type-vertical" />
              <div className="col-center">
                <div className="footer-link-list">
                  <FooterAccordionItem
                    id="footer4-company"
                    className="footer-col-block type-white footer-wrap-2"
                    heading="COMPANY"
                    headingClassName="footer-heading footer-heading-mobile text-white"
                  >
                    <ul className="footer-menu-list">
                      <li>
                        <Link href={`/about`} className="cl-text-3 link">
                          About Us
                        </Link>
                      </li>
                      <li>
                        <Link href={`/our-store`} className="cl-text-3 link">
                          Our Stories
                        </Link>
                      </li>
                      <li>
                        <Link href={`/contact`} className="cl-text-3 link">
                          Contact us
                        </Link>
                      </li>
                      <li>
                        <Link href={`/blog`} className="cl-text-3 link">
                          Latest New
                        </Link>
                      </li>
                      <li>
                        <Link href={`/account-page`} className="cl-text-3 link">
                          My Account
                        </Link>
                      </li>
                    </ul>
                  </FooterAccordionItem>
                  <FooterAccordionItem
                    id="footer4-customer"
                    className="footer-col-block type-white footer-wrap-3"
                    heading="CUSTOMER"
                    headingClassName="footer-heading footer-heading-mobile text-white"
                  >
                    <ul className="footer-menu-list">
                      <li>
                        <Link href={`/shipping`} className="cl-text-3 link">
                          Shipping
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`/return-and-refund`}
                          className="cl-text-3 link"
                        >
                          Return &amp; Refund
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`/privacy-policy`}
                          className="cl-text-3 link"
                        >
                          Privacy Policy
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`/term-and-condition`}
                          className="cl-text-3 link"
                        >
                          Terms &amp; Conditions
                        </Link>
                      </li>
                      <li>
                        <Link href={`/faq`} className="cl-text-3 link">
                          Orders FAQs
                        </Link>
                      </li>
                    </ul>
                  </FooterAccordionItem>
                  <FooterAccordionItem
                    id="footer4-account"
                    className="footer-col-block type-white footer-wrap-4"
                    heading="MY ACCOUNT"
                    headingClassName="footer-heading footer-heading-mobile text-white"
                  >
                    <ul className="footer-menu-list">
                      <li>
                        <Link href={`/login`} className="cl-text-3 link">
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link href={`/register`} className="cl-text-3 link">
                          Sign up
                        </Link>
                      </li>
                      <li>
                        <Link href={`/account-page`} className="cl-text-3 link">
                          My Account
                        </Link>
                      </li>
                      <li>
                        <Link href={`/wishlist`} className="cl-text-3 link">
                          Wish List
                        </Link>
                      </li>
                    </ul>
                  </FooterAccordionItem>
                </div>
              </div>
              <div className="br-line type-vertical" />
              <div className="col-right">
                <FooterAccordionItem
                  id="footer4-newsletter"
                  className="footer-col-block type-white footer-wrap-end"
                  heading="NEWSLETTER"
                  headingClassName="footer-heading footer-heading-mobile text-white"
                >
                  <p className="footer-desc cl-text-3 mb-16">
                    Subscribe for store updates and discounts.
                  </p>
                  <NewsletterForm className="form-sub mb-16" />
                  <p className="text-remember cl-text-3">
                    By clicking subcribe, you agree to the{" "}
                    <Link
                      href={`/term-and-condition`}
                      className="text-white link link-underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href={`/privacy-policy`}
                      className="text-white link link-underline"
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
      <div className="footer-hero-text">
        <div className="container-full">
          <span className="text-white fw-semibold">AMERCE STORE</span>
        </div>
      </div>
      <div className="footer-bottom position-relative">
        <div className="br-line fake-class top-0 bg-white_10" />
        <div className="container-full">
          <div className="inner-bottom lg-justify-content-center">
            <p className="text-nocopy cl-text-3">
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
