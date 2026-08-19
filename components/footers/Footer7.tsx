import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import TfSwiper from "@/components/ui/TfSwiper";
import { features } from "@/data/features";
import {
  footerStore,
  footerCompanyLinks,
  footerCustomerLinks,
  footerAccountLinksModal,
  footerPaymentIcons,
} from "@/data/footer";
import CurrencySelect from "../common/CurrencySelect";
import LanguageSelect from "../common/LanguageSelect";
import FooterAccordionWrapper, {
  FooterAccordionItem,
} from "./FooterAccordionWrapper";

export default function Footer7() {
  return (
    <footer className="tf-footer footer-s5 bg-main-5">
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
          >
            {features.map((item) => (
              <div
                key={item.title}
                className="box-icon_V01 style-3 wow fadeInLeft"
              >
                <span className="icon">
                  <i className={item.icon} aria-hidden />
                </span>
                <div className="content">
                  <h4 className="title">{item.title}</h4>
                  <p className="text cl-text-2">{item.text}</p>
                </div>
              </div>
            ))}
          </TfSwiper>
        </div>
      </div>
      <div className="position-relative">
        <div className="br-line fake-class top-0" />
        <div className="br-line fake-class bottom-0 d-none d-sm-flex" />
        <div className="container-full">
          <FooterAccordionWrapper>
            <div className="footer-inner flat-spacing">
              <div className="col-left">
                <FooterAccordionItem
                  id="footer7-store"
                  className="footer-col-block footer-wrap-start"
                  heading="OUR STORE"
                  headingClassName="footer-heading footer-heading-mobile "
                >
                  <p className="cl-text-2 mb-4">{footerStore.supportLabel}</p>
                  <a
                    href={footerStore.phoneHref}
                    className="link h4 fw-medium mb-12"
                  >
                    {footerStore.phone}
                  </a>
                  <Link
                    href={footerStore.addressHref}
                    className="cl-text-2 link mb-4"
                  >
                    {footerStore.address}
                  </Link>
                  <a
                    href={`mailto:${footerStore.email}`}
                    className="cl-text-2 link"
                  >
                    {footerStore.email}
                  </a>
                </FooterAccordionItem>
              </div>
              <div className="br-line type-vertical cl-nor" />
              <div className="col-center">
                <div className="footer-link-list">
                  <FooterAccordionItem
                    id="footer7-company"
                    className="footer-col-block footer-wrap-2"
                    heading={footerCompanyLinks.title}
                    headingClassName="footer-heading footer-heading-mobile "
                  >
                    <ul className="footer-menu-list">
                      {footerCompanyLinks.links.map((link) => (
                        <li key={link.href + link.label}>
                          <Link href={link.href} className="cl-text-2 link">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </FooterAccordionItem>
                  <FooterAccordionItem
                    id="footer7-customer"
                    className="footer-col-block footer-wrap-3"
                    heading={footerCustomerLinks.title}
                    headingClassName="footer-heading footer-heading-mobile "
                  >
                    <ul className="footer-menu-list">
                      {footerCustomerLinks.links.map((link) => (
                        <li key={link.href + link.label}>
                          <Link href={link.href} className="cl-text-2 link">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </FooterAccordionItem>
                  <FooterAccordionItem
                    id="footer7-account"
                    className="footer-col-block footer-wrap-4"
                    heading={footerAccountLinksModal.title}
                    headingClassName="footer-heading footer-heading-mobile "
                  >
                    <ul className="footer-menu-list">
                      {footerAccountLinksModal.links.map((link) => (
                        <li key={link.href + link.label}>
                          {link.href.startsWith("#") ? (
                            <a
                              href={link.href}
                              data-bs-toggle="modal"
                              className="cl-text-2 link"
                            >
                              {link.label}
                            </a>
                          ) : (
                            <Link href={link.href} className="cl-text-2 link">
                              {link.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </FooterAccordionItem>
                </div>
              </div>
              <div className="br-line type-vertical cl-nor" />
              <div className="col-right">
                <FooterAccordionItem
                  id="footer7-newsletter"
                  className="footer-col-block footer-wrap-end"
                  heading="NEWSLETTER"
                  headingClassName="footer-heading footer-heading-mobile "
                >
                  <p className="footer-desc cl-text-2 mb-16">
                    Subscribe for store updates and discounts.
                  </p>
                  <NewsletterForm className="form-sub mb-16" />
                  <p className="text-remember cl-text-2">
                    By clicking subcribe, you agree to the{" "}
                    <Link href="#" className="link link-underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="link link-underline">
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
        <div className="container-full">
          <div className="inner-bottom">
            <div className="tf-list list-currenci">
              <div className="tf-currencies">
                <CurrencySelect textColor="color-text-2" />
              </div>
              <div className="tf-languages">
                <LanguageSelect textColor="color-text-2" />
              </div>
            </div>
            <p className="text-nocopy cl-text-2">
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
