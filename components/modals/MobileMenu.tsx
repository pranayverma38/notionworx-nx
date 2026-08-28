"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { notionWorxMobileMenuItems, type SiteNavItem } from "@/data/notionworxNav";
import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";
import CurrencySelect from "../common/CurrencySelect";
import LanguageSelect from "../common/LanguageSelect";

export default function MobileMenu({
  registerOffcanvasElement,
}: {
  registerOffcanvasElement?: (el: HTMLElement | null) => void;
}) {
  const router = useRouter();

  const renderMobileMenuItems = (
    items: SiteNavItem[],
    parentKey = "menu",
    level = 0,
  ) => (
    <ul
      className={
        level === 0 ? "nav-ul-mb" : `sub-nav-menu${level > 1 ? " sub-menu-level-2" : ""}`
      }
      {...(level === 0 ? { id: "wrapper-menu-navigation" } : {})}
    >
      {items.map((item, index) => {
        const hasChildren = Boolean(item.children?.length);
        const collapseId = `${parentKey}-${index}`;

        if (hasChildren) {
          return (
            <li
              key={`${collapseId}-${item.label}`}
              className={level === 0 ? "nav-mb-item" : undefined}
            >
              <a
                href={`#${collapseId}`}
                className={level === 0 ? "collapsed mb-menu-link" : "collapsed sub-nav-link"}
                data-bs-toggle="collapse"
                aria-expanded="false"
                aria-controls={collapseId}
              >
                <span>{item.label}</span>
                <span
                  className={
                    level === 0 ? "icon ic-custom" : "icon icon-CaretDown"
                  }
                  aria-hidden
                />
              </a>
              <div id={collapseId} className="collapse">
                {renderMobileMenuItems(item.children ?? [], collapseId, level + 1)}
              </div>
            </li>
          );
        }

        return (
          <li
            key={`${collapseId}-${item.label}`}
            className={level === 0 ? "nav-mb-item" : undefined}
          >
            <Link
              href={item.href ?? "#"}
              className={level === 0 ? "mb-menu-link" : "sub-nav-link"}
              target={item.newTab ? "_blank" : undefined}
              rel={item.newTab ? "noreferrer" : undefined}
            >
              <span className={level === 0 ? undefined : "cus-text"}>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

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
          {renderMobileMenuItems(notionWorxMobileMenuItems)}
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
