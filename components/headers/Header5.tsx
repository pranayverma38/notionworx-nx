"use client";
import Link from "next/link";
import Image from "next/image";

import Nav from "./Nav";
import { useStickyCategoryHeader } from "@/hooks/useStickyCategoryHeader";
import CurrencySelect from "../common/CurrencySelect";
import LanguageSelect from "../common/LanguageSelect";
import BrowseByCategoryNav from "./BrowseByCategoryNav";
import CartIconCount from "./CartIconCount";
import CategorySearch from "./CategorySearch";

export default function Header5() {
  const {
    toggleBottomNav,
    showHeaderBottom,
    headerStyle,
    stickyHeaderClassName,
  } = useStickyCategoryHeader({ hiddenTop: "-200px" });

  return (
    <header
      style={headerStyle}
      className={`tf-header header-s6 has-by-category${stickyHeaderClassName}`}
    >
      <div className="br-line fake-class bottom-0 d-xl-none" />
      <div className="header-inner_wrap">
        <div className="container">
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
            <div className="header-left">
              <div className="box-open-header-bottom m-0">
                <div
                  className="btn-open-header-bottom cs-pointer"
                  onClick={toggleBottomNav}
                >
                  <i className="icon icon-List fs-24" />
                </div>
              </div>
              <Link href={`/home-baby`} className="logo-site">
                <Image
                  loading="lazy"
                  width={150}
                  height={30}
                  src="/assets/images/logo/logo.svg"
                  alt="Image"
                />
              </Link>
              <div className="d-none d-xl-block">
                <nav className="box-navigation">
                  <ul className="box-nav-menu">
                    <Nav variant3 />
                  </ul>
                </nav>
              </div>
            </div>
            <div className="header-right">
              <div className="tf-list list-currenci d-none d-xl-flex">
                <div className="tf-currencies">
                  <CurrencySelect textBlack />
                </div>
                <div className="br-line type-vertical" />
                <div className="tf-languages">
                  <LanguageSelect textBlack />
                </div>
              </div>
              <ul className="nav-icon-list d-xl-none">
                <li className="d-none d-sm-block">
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
                    className="nav-icon-item link"
                  >
                    <i className="icon icon-User" />
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
          <div className="br-line d-none d-xl-flex" />
        </div>
      </div>
      {showHeaderBottom ? (
        <div className={`header-bottom_wrap d-none d-xl-block`}>
          <div className="container">
            <div className="header-bottom">
              <div className="col-left">
                <div className="nav-category-wrap main-action-active">
                  <BrowseByCategoryNav hasRadiusBtn hasRadiusBox />
                </div>
              </div>
              <div className="col-center">
                <CategorySearch parentClass="form_search-product style-2 radius-8" />
              </div>
              <div className="col-right">
                <ul className="nav-icon-list">
                  <li>
                    <a
                      href="#sign"
                      data-bs-toggle="modal"
                      className="nav-icon-item link has-text"
                    >
                      <i className="icon icon-User" />
                      <span className="d-none d-md-block">
                        {" "}
                        Login/Register{" "}
                      </span>
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
      ) : null}
    </header>
  );
}
