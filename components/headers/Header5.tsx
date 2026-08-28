"use client";
import UserIconButton from "@/components/headers/UserIconButton";
import NotionWorxLogo from "@/components/headers/NotionWorxLogo";
import Link from "next/link";

import Nav from "./Nav";
import { useStickyCategoryHeader } from "@/hooks/useStickyCategoryHeader";
import LanguageSelect from "../common/LanguageSelect";
import BrowseByCategoryNav from "./BrowseByCategoryNav";
import CartIconCount from "./CartIconCount";
import HeaderServiceHighlights from "./HeaderServiceHighlights";

export default function Header5() {
  const {
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
            <div className="box-open-menu-mobile d-md-none">
              <a
                href="#mobileMenu"
                data-bs-toggle="offcanvas"
                className="btn-open-menu"
              >
                <i className="icon icon-List" />
              </a>
            </div>
            <div className="header-left">
              <Link href="/" className="logo-site d-flex align-items-center">
                <NotionWorxLogo />
              </Link>
              <div className="d-none d-xl-block">
                <nav className="box-navigation">
                  <ul className="box-nav-menu">
                    <Nav variant3 />
                  </ul>
                </nav>
              </div>
            </div>
            <div className="header-right align-items-center">
              <div className="tf-list list-currenci d-none d-xl-flex">
                <div className="tf-languages">
                  <LanguageSelect textBlack />
                </div>
              </div>
              <ul className="nav-icon-list d-none d-xl-flex">
                <li>
                  <UserIconButton />
                </li>
                <li>
                  <Link href="/view-cart" className="nav-icon-item link shop-cart">
                    <i className="icon icon-Handbag" />
                    <CartIconCount />
                  </Link>
                </li>
              </ul>
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
                  <UserIconButton />
                </li>
                <li>
                  <Link href="/view-cart" className="nav-icon-item link shop-cart">
                    <i className="icon icon-Handbag" />
                    <CartIconCount />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="br-line d-none d-xl-flex" />
        </div>
      </div>
      <div className="header-mobile-highlights d-xl-none">
        <div className="container">
          <HeaderServiceHighlights compact />
        </div>
      </div>
      {showHeaderBottom ? (
        <div className={`header-bottom_wrap d-none d-xl-block`}>
          <div className="container">
            <div className="header-bottom">
              <div className="col-left">
                <div className="nav-category-wrap main-action-active">
                  <BrowseByCategoryNav
                    hasRadiusBtn
                    hasRadiusBox
                    hasHubbergBtn={false}
                  />
                </div>
              </div>
              <div className="col-center">
                <HeaderServiceHighlights />
              </div>
              <div className="col-right" />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
