"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { browseByCategoryItems } from "@/data/browseByCategory";

export default function BrowseByCategoryNav({
  hasRadiusBtn = false,
  hasRadiusBox = false,
  hasHubbergBtn = true,
}: {
  hasRadiusBtn?: boolean;
  hasRadiusBox?: boolean;
  hasHubbergBtn?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!navRef.current) return;
      const target = event.target as Node;
      if (!navRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div ref={navRef}>
      <div
        className={`btn-nav-drop btn-active text-nowrap ${hasRadiusBtn ? "radius-8" : ""} ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {hasHubbergBtn ? <i className="icon icon-List fs-24" /> : ""}
        <span className="name-category fw-medium">Browse by Category</span>
        <i className="icon icon-CaretDown" />
      </div>
      <ul
        className={`box-nav-category active-item ${isOpen ? "active" : ""} ${hasRadiusBox ? "radius-12" : ""}`}
      >
        {browseByCategoryItems.map((item) => {
          const hasSubNav = Boolean(item.subSections?.length);
          const showCaret = item.showCaret || hasSubNav;

          return (
            <li
              key={item.label}
              className={hasSubNav ? "has-sub-nav-category" : undefined}
            >
              <Link href={item.href} className="nav-category_link">
                {item.label}
                {showCaret ? <i className="icon icon-CaretRightThin" /> : null}
              </Link>

              {hasSubNav ? (
                <div className="sub-nav-category">
                  <div className="tf-grid-layout xl-col-3">
                    {item.subSections?.map((section) => (
                      <div
                        key={section.title}
                        className="sub-nav-category_list"
                      >
                        <div className="sub-nav__title fw-semibold">
                          {section.title}
                        </div>
                        {section.links.map((subLink) => (
                          <Link
                            key={`${section.title}-${subLink.label}`}
                            href={subLink.href}
                            className="sub-nav__link tf-btn-line"
                          >
                            {subLink.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
