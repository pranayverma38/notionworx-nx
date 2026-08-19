import Link from "next/link";
import Image from "next/image";

import { NewsletterForm } from "@/components/forms/NewsletterForm";
import CurrencySelect from "../common/CurrencySelect";
import LanguageSelect from "../common/LanguageSelect";
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
                <Link href={`/`} className="logo-site mb-16">
                  <Image
                    loading="lazy"
                    width={150}
                    height={30}
                    src="/assets/images/logo/logo.svg"
                    alt="Image"
                  />
                </Link>
                <p className="lh-26 cl-text-2">
                  600 N Michigan Ave, Chicago, IL 60611, USA
                </p>
                <a
                  href="https://www.google.com/maps?q=600+N+Michigan+Ave+Chicago,+IL+60611+USA"
                  target="_blank"
                  className="text-decoration-underline text-primary lh-26 mb-16"
                >
                  Open in Maps
                </a>
                <a
                  href="mailto:hi.amere@gmail.com"
                  className="cl-text-2 link mb-8"
                >
                  hi.amere@gmail.com
                </a>
                <a href="tel:3156666688" className="cl-text-2 link mb-16">
                  315-666-6688
                </a>
                <ul className="tf-social-icon-2">
                  <li>
                    <a href="https://www.facebook.com/" target="_blank">
                      <i className="icon icon-FacebookLogo" />
                    </a>
                  </li>
                  <li>
                    <a href="https://x.com/" target="_blank">
                      <i className="icon icon-XLogo" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/" target="_blank">
                      <i className="icon icon-InstagramLogo" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.tiktok.com/" target="_blank">
                      <i className="icon icon-TiktokLogo" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.snapchat.com/" target="_blank">
                      <i className="icon icon-SnapchatLogo" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-sm-6 col-md-6 col-lg-2">
              <FooterAccordionItem
                id="footer1-company"
                className="footer-col-block footer-wrap-1 mx-xl-auto"
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
            <div className="col-sm-6 col-md-6 col-lg-2">
              <FooterAccordionItem
                id="footer1-customer"
                className="footer-col-block footer-wrap-2 mx-xl-auto"
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
                id="footer1-newsletter"
                className="footer-col-block footer-wrap-3 mb-0"
                heading="NEWSLETTER"
                headingClassName="footer-heading footer-heading-mobile"
              >
                  <p className="footer-desc cl-text-2">
                    Subscribe for store updates and discounts.
                  </p>
                  <NewsletterForm />
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
                      Privacy Policy{" "}
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
          <div className="br-line sm-d-none" />
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
