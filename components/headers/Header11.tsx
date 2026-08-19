"use client";
import Link from "next/link";
import Image from "next/image";

import Nav from "./Nav";
import { useStickyCategoryHeader } from "@/hooks/useStickyCategoryHeader";
import BrowseByCategoryNav from "./BrowseByCategoryNav";
import CartIconCount from "./CartIconCount";

export default function Header11() {
  const {
    toggleBottomNav,
    showHeaderBottom,
    headerStyle,
    stickyHeaderClassName,
  } = useStickyCategoryHeader();

  return (
    <header
      style={headerStyle}
      className={`tf-header header-s8 has-by-category${stickyHeaderClassName}`}
    >
      <div className="br-line fake-class bottom-0 d-xl-none" />
      <div className="header-inner_wrap">
        <div className="container-full">
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
              <Link href={`/home-furniture`} className="logo-site d-flex">
                <Image
                  loading="lazy"
                  width={150}
                  height={30}
                  src="/assets/images/logo/logo.svg"
                  alt="Image"
                />
              </Link>
              <div className="wrap-left d-none d-xl-flex">
                <div className="nav-category-wrap style-4 main-action-active d-none d-xl-block">
                  <BrowseByCategoryNav hasHubbergBtn={false} hasRadiusBtn />
                </div>
                <form
                  className="form-search-nav style-5 d-none d-xl-flex"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input type="text" placeholder="Search Products" required />
                  <button type="submit" className="btn-action-submit">
                    <i className="icon icon-MagnifyingGlass" />
                  </button>
                </form>
              </div>
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
                    <span className="d-none d-xl-block">Login/Register</span>
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
          <div className="container-full">
            <div className="header-bottom">
              <div className="col-left">
                <nav className="box-navigation">
                  <ul className="box-nav-menu">
                    <Nav />
                  </ul>
                </nav>
              </div>
              <div className="col-right">
                <p className="d-flex fw-medium align-items-center gap-8 lh-24">
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
