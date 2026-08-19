"use client";
import Link from "next/link";
import Image from "next/image";

import BrowseByCategoryNav from "./BrowseByCategoryNav";
import Nav from "./Nav";
import { useStickyCategoryHeader } from "@/hooks/useStickyCategoryHeader";
import CartIconCount from "./CartIconCount";
import CategorySearch from "./CategorySearch";

export default function Header2({
  isContainerFull,
  navCategoryStyle = "",
}: {
  isContainerFull?: boolean;
  navCategoryStyle?: string;
}) {
  const {
    toggleBottomNav,
    showHeaderBottom,
    headerStyle,
    stickyHeaderClassName,
  } = useStickyCategoryHeader();
  const containerClass = isContainerFull ? "container-full" : "container";
  return (
    <header
      className={`tf-header header-s3 has-by-category${stickyHeaderClassName}`}
      style={headerStyle}
    >
      <div className="br-line fake-class bottom-0 d-xl-none" />
      <div className="header-inner_wrap">
        <div className={containerClass}>
          <div className="header-inner">
            <div className="box-open-menu-mobile d-xl-none">
              <a
                href="#mobileMenu"
                data-bs-toggle="offcanvas"
                className="btn-open-menu"
              >
                <i className="icon icon-List" />
              </a>
            </div>
            <div className="box-open-header-bottom">
              <div
                className="btn-open-header-bottom cs-pointer"
                onClick={toggleBottomNav}
              >
                <i className="icon icon-List fs-24" />
              </div>
            </div>
            <div className="header-left">
              <Link href={`/home-mental`} className="logo-site">
                <Image
                  loading="lazy"
                  width={150}
                  height={30}
                  src="/assets/images/logo/logo.svg"
                  alt="Image"
                />
              </Link>
            </div>
            <div className="header-center d-none d-xl-block">
              <CategorySearch />
            </div>
            <div className="header-right">
              <ul className="nav-icon-list">
                <li className="d-none d-sm-block d-xl-none">
                  <a
                    href="#search"
                    data-bs-toggle="modal"
                    className="nav-icon-item link"
                  >
                    <i className="icon icon-MagnifyingGlass" />
                  </a>
                </li>
                <li>
                  <a
                    href="#sign"
                    data-bs-toggle="modal"
                    className="nav-icon-item link has-text"
                  >
                    <i className="icon icon-User" />
                    <span className="d-none d-xl-block"> Login/Register </span>
                  </a>
                </li>
                <li className="d-none d-sm-block">
                  <Link href={`/wishlist`} className="nav-icon-item link">
                    <i className="icon icon-HeartStraight" />
                  </Link>
                </li>
                <li>
                  <a
                    href="#shoppingCart"
                    data-bs-toggle="offcanvas"
                    className="nav-icon-item link shop-cart"
                  >
                    <i className="icon icon-Handbag" />
                    <CartIconCount />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {showHeaderBottom ? (
        <div className={`header-bottom_wrap d-none d-xl-block`}>
          <div className={containerClass}>
            <div className="header-bottom">
              <div className="col-left">
                <div
                  className={`nav-category-wrap main-action-active ${navCategoryStyle}`}
                >
                  <BrowseByCategoryNav />
                </div>
                <nav className="box-navigation">
                  <ul className="box-nav-menu">
                    <Nav variant2 />
                  </ul>
                </nav>
              </div>
              <div className="col-right">
                <p className="text-primary fw-medium d-flex align-items-center gap-8">
                  <i className="icon icon-SealPercent fs-24" />
                  Special Offers!
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
