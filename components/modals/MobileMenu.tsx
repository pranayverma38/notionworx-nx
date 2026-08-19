"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";
import {
  navHomeLinks,
  navShop,
  navProduct,
  navBlog,
  navPages,
} from "@/data/nav";
import CurrencySelect from "../common/CurrencySelect";
import LanguageSelect from "../common/LanguageSelect";

export default function MobileMenu({
  registerOffcanvasElement,
}: {
  registerOffcanvasElement?: (el: HTMLElement | null) => void;
}) {
  const router = useRouter();

  return (
    <div
      ref={registerOffcanvasElement}
      className="offcanvas offcanvas-start canvas-mb"
      id="mobileMenu"
    >
      <div className="canvas-header">
        <span className="icon-close-popup" data-bs-dismiss="offcanvas">
          <i className="icon icon-X2" aria-hidden />
        </span>
        <PreventDefaultForm
          className="form-search-nav"
          onSubmit={(e) => {
            const formData = new FormData(e.currentTarget);
            const query = String(formData.get("q") ?? "").trim();
            router.push(
              query
                ? `/search-result?query=${encodeURIComponent(query)}`
                : "/search-result",
            );
          }}
        >
          <fieldset>
            <input
              type="text"
              name="q"
              placeholder="What are you looking for?"
              required
            />
          </fieldset>
          <button type="submit" className="btn-action">
            <i className="icon icon-MagnifyingGlass" aria-hidden />
          </button>
        </PreventDefaultForm>
      </div>

      <div className="canvas-body">
        <div className="mb-content-top">
          <ul className="nav-ul-mb" id="wrapper-menu-navigation">
            <li className="nav-mb-item">
              <a
                href="#dropdown-menu-0"
                className="mb-menu-link collapsed"
                data-bs-toggle="collapse"
                aria-expanded="false"
                aria-controls="dropdown-menu-0"
              >
                <span>Home</span>
                <span className="icon ic-custom" aria-hidden />
              </a>
              <div id="dropdown-menu-0" className="collapse">
                <ul className="sub-nav-menu">
                  {navHomeLinks
                    .flatMap((column) => column)
                    .map((item, index) => (
                      <li key={index}>
                        <Link href={item.href} className="sub-nav-link">
                          <span className="cus-text">{item.text}</span>
                          {item.label && (
                            <span className={`demo-label type-${item.label}`}>
                              {item.label === "hot"
                                ? "Hot"
                                : item.label === "new"
                                  ? "New"
                                  : "Trend"}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </li>

            <li className="nav-mb-item">
              <a
                href="#dropdown-menu-1"
                className="collapsed mb-menu-link"
                data-bs-toggle="collapse"
                aria-expanded="false"
                aria-controls="dropdown-menu-1"
              >
                <span>Shop</span>
                <span className="icon ic-custom" aria-hidden />
              </a>
              <div id="dropdown-menu-1" className="collapse">
                <ul className="sub-nav-menu">
                  {navShop.map((group, groupIndex) => (
                    <li key={groupIndex}>
                      <a
                        href={`#dropdown-menu-1-group-${groupIndex}`}
                        className="collapsed sub-nav-link"
                        data-bs-toggle="collapse"
                        aria-expanded="false"
                        aria-controls={`dropdown-menu-1-group-${groupIndex}`}
                      >
                        <span>{group.title}</span>
                        <span className="icon icon-CaretDown" aria-hidden />
                      </a>
                      <div
                        id={`dropdown-menu-1-group-${groupIndex}`}
                        className="collapse"
                      >
                        <ul className="sub-nav-menu sub-menu-level-2">
                          {group.links.map((link, linkIndex) => (
                            <li key={linkIndex}>
                              <Link href={link.href} className="sub-nav-link">
                                <span className="cus-text">{link.text}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            <li className="nav-mb-item">
              <a
                href="#dropdown-menu-2"
                className="collapsed mb-menu-link"
                data-bs-toggle="collapse"
                aria-expanded="false"
                aria-controls="dropdown-menu-2"
              >
                <span>Product</span>
                <span className="icon ic-custom" aria-hidden />
              </a>
              <div id="dropdown-menu-2" className="collapse">
                <ul className="sub-nav-menu">
                  {navProduct.map((group, groupIndex) => (
                    <li key={groupIndex}>
                      <a
                        href={`#dropdown-menu-2-group-${groupIndex}`}
                        className="collapsed sub-nav-link"
                        data-bs-toggle="collapse"
                        aria-expanded="false"
                        aria-controls={`dropdown-menu-2-group-${groupIndex}`}
                      >
                        <span>{group.title}</span>
                        <span className="icon icon-CaretDown" aria-hidden />
                      </a>
                      <div
                        id={`dropdown-menu-2-group-${groupIndex}`}
                        className="collapse"
                      >
                        <ul className="sub-nav-menu sub-menu-level-2">
                          {group.links.map((link, linkIndex) => (
                            <li key={linkIndex}>
                              <Link href={link.href} className="sub-nav-link">
                                <span className="cus-text">{link.text}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            <li className="nav-mb-item">
              <a
                href="#dropdown-menu-3"
                className="collapsed mb-menu-link"
                data-bs-toggle="collapse"
                aria-expanded="false"
                aria-controls="dropdown-menu-3"
              >
                <span>Blog</span>
                <span className="icon ic-custom" aria-hidden />
              </a>
              <div id="dropdown-menu-3" className="collapse">
                <ul className="sub-nav-menu">
                  {navBlog.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link href={link.href} className="sub-nav-link">
                        <span className="cus-text">{link.text}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            <li className="nav-mb-item">
              <a
                href="#dropdown-menu-4"
                className="collapsed mb-menu-link"
                data-bs-toggle="collapse"
                aria-expanded="false"
                aria-controls="dropdown-menu-4"
              >
                <span>Pages</span>
                <span className="icon ic-custom" aria-hidden />
              </a>
              <div id="dropdown-menu-4" className="collapse">
                <ul className="sub-nav-menu">
                  {navPages.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link href={link.href} className="sub-nav-link">
                        <span className="cus-text">{link.text}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            <li className="nav-mb-item">
              <a
                href="https://themeforest.net/user/themesflat/portfolio"
                target="_blank"
                className="mb-menu-link"
              >
                <span>Buy Template</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="need-help-wrap">
          <p className="nd-title h6 fw-medium mb-16">Need Help?</p>
          <p className="lh-26 cl-text-2 mb-4">
            600 N Michigan Ave, Chicago, IL 60611, USA
          </p>
          <a
            href="https://www.google.com/maps?q=600+N+Michigan+Ave+Chicago,+IL+60611+USA"
            target="_blank"
            className="text-decoration-underline text-primary lh-26 mb-16"
          >
            Open in Maps
          </a>
          <a href="mailto:hi.amere@gmail.com" className="cl-text-2 link mb-8">
            hi.amere@gmail.com
          </a>
          <a href="tel:3156666688" className="cl-text-2 link">
            315-666-6688
          </a>
        </div>
      </div>

      <div className="canvas-footer">
        <div className="d-flex justify-content-center border-end">
          <div className="tf-currencies">
            <CurrencySelect textBlack />
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <div className="tf-languages">
            <LanguageSelect textBlack />
          </div>
        </div>
      </div>
    </div>
  );
}
