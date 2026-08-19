import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import TfSwiper from "@/components/ui/TfSwiper";
import { features } from "@/data/features";
import {
  footerStore,
  footerCompanyLinks,
  footerCustomerLinks,
  footerAccountLinksPage,
  footerPaymentIcons,
} from "@/data/footer";
import CurrencySelect from "../common/CurrencySelect";
import LanguageSelect from "../common/LanguageSelect";
import FooterAccordionWrapper, {
  FooterAccordionItem,
} from "./FooterAccordionWrapper";

export default function Footer9({
  parentClass = "tf-footer footer-s5 bg-dark",
}) {
  const isDark = parentClass.includes("bg-dark");
  const textColorClass = isDark ? "cl-text-3" : "cl-text-2";
  const hrColorClass = isDark ? "" : "cl-nor";
  const selectColor = isDark ? "white" : "cl-text-2";
  const headingColorClass = isDark ? "text-white" : "";

  const lineClass = isDark ? "bg-white_10" : "";

  return (
    <footer className={parentClass}>
      <div className="flat-spacing-4">
        <div className="container-full">
          <TfSwiper
            preview={4}
            tablet={3}
            mobileSm={2}
            mobile={1}
            spaceLg={30}
            spaceMd={20}
            space={10}
            pagination={1}
            paginationSm={2}
            paginationMd={3}
            paginationLg={4}
            paginationClassName="sw-line-default style-2 tf-sw-pagination"
          >
            {features.map((item) => (
              <div
                key={item.title}
                className="box-icon_V01 style-3 wow fadeInLeft"
              >
                <span className="icon">
                  <i
                    className={`${item.icon}${isDark ? " text-white" : ""}`}
                    aria-hidden
                  />
                </span>
                <div className="content">
                  <div className={`h6 title ${isDark ? "text-white" : ""}`}>
                    {item.title}
                  </div>
                  <p className={`text ${textColorClass}`}>{item.text}</p>
                </div>
              </div>
            ))}
          </TfSwiper>
        </div>
      </div>
      <div className="position-relative">
        <div className={`br-line fake-class top-0 ${lineClass}`} />
        <div
          className={`br-line fake-class bottom-0 ${lineClass} d-none d-sm-flex`}
        />
        <div className="container-full">
          <FooterAccordionWrapper>
            <div className="footer-inner flat-spacing">
              <div className="col-left">
                <FooterAccordionItem
                  id="footer9-store"
                  className={`footer-col-block ${isDark ? "type-white" : ""} footer-wrap-start`}
                  heading="OUR STORE"
                  headingClassName={`footer-heading footer-heading-mobile ${headingColorClass}`}
                >
                  <p className={`${textColorClass} mb-4`}>
                    {footerStore.supportLabel}
                  </p>
                  <a
                    href={footerStore.phoneHref}
                    className={`${isDark ? "text-white" : ""} link h4 fw-medium mb-12`}
                  >
                    {footerStore.phone}
                  </a>
                  <a
                    href={footerStore.addressHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${textColorClass} link mb-4`}
                  >
                    {footerStore.address}
                  </a>
                  <a
                    href={`mailto:${footerStore.email}`}
                    className={`${textColorClass} link`}
                  >
                    {footerStore.email}
                  </a>
                </FooterAccordionItem>
              </div>
              <div className={`br-line type-vertical ${hrColorClass}`} />
              <div className="col-center">
                <div className="footer-link-list">
                  <FooterAccordionItem
                    id="footer9-company"
                    className={`footer-col-block ${isDark ? "type-white" : ""} footer-wrap-2`}
                    heading={footerCompanyLinks.title}
                    headingClassName={`footer-heading footer-heading-mobile ${headingColorClass}`}
                  >
                    <ul className="footer-menu-list">
                      {footerCompanyLinks.links.map((link) => (
                        <li key={link.href + link.label}>
                          <Link
                            href={link.href}
                            className={`${textColorClass} link`}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </FooterAccordionItem>
                  <FooterAccordionItem
                    id="footer9-customer"
                    className={`footer-col-block ${isDark ? "type-white" : ""} footer-wrap-3`}
                    heading={footerCustomerLinks.title}
                    headingClassName={`footer-heading footer-heading-mobile ${headingColorClass}`}
                  >
                    <ul className="footer-menu-list">
                      {footerCustomerLinks.links.map((link) => (
                        <li key={link.href + link.label}>
                          <Link
                            href={link.href}
                            className={`${textColorClass} link`}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </FooterAccordionItem>
                  <FooterAccordionItem
                    id="footer9-account"
                    className={`footer-col-block ${isDark ? "type-white" : ""} footer-wrap-4`}
                    heading={footerAccountLinksPage.title}
                    headingClassName={`footer-heading footer-heading-mobile ${headingColorClass}`}
                  >
                    <ul className="footer-menu-list">
                      {footerAccountLinksPage.links.map((link) => (
                        <li key={link.href + link.label}>
                          <Link
                            href={link.href}
                            className={`${textColorClass} link`}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </FooterAccordionItem>
                </div>
              </div>
              <div className={`br-line type-vertical ${hrColorClass}`} />
              <div className="col-right">
                <FooterAccordionItem
                  id="footer9-newsletter"
                  className={`footer-col-block ${isDark ? "type-white" : ""} footer-wrap-end`}
                  heading="NEWSLETTER"
                  headingClassName={`footer-heading footer-heading-mobile ${headingColorClass}`}
                >
                  <p className={`footer-desc ${textColorClass} mb-16`}>
                    Subscribe for store updates and discounts.
                  </p>
                  <NewsletterForm className="form-sub mb-16" />
                  <p className={`text-remember ${textColorClass}`}>
                    By clicking subcribe, you agree to the{" "}
                    <Link
                      href="#"
                      className={`${headingColorClass} link link-underline`}
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="#"
                      className={`${headingColorClass} link link-underline`}
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
      <div className="footer-bottom border-top-0">
        <div className="container-full">
          <div className="inner-bottom">
            <div className="tf-list list-currenci">
              <div className="tf-currencies">
                <CurrencySelect textColor={`color-${selectColor}`} />
              </div>
              <div className="tf-languages">
                <LanguageSelect textColor={`color-${selectColor}`} />
              </div>
            </div>
            <p className={`text-nocopy ${textColorClass}`}>
              ©2026 Amerce. All Rights Reserved.
            </p>
            <ul className="tf-list payment-list">
              {footerPaymentIcons.map((icon) => (
                <li key={icon.src}>
                  <Image
                    src={`${icon.src}`}
                    alt={icon.alt}
                    width={38}
                    height={24}
                    loading="lazy"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
