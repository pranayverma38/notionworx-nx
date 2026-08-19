"use client";
import Link from "next/link";
import Image from "next/image";

import Nav from "./Nav";
import { useHeaderSticky } from "@/hooks/useHeaderSticky";
import CurrencySelect from "../common/CurrencySelect";
import LanguageSelect from "../common/LanguageSelect";
import CartIconCount from "./CartIconCount";

export default function Header4({parentClass = "tf-header header-s5 scr-box-shadow"}) {
  const headerSticky = useHeaderSticky();

  return (
    <header
      style={{
        top: headerSticky ? "0px" : "-150px",
        transition: "top 0.3s ease-in-out",
      }}
      className={`${parentClass}${headerSticky ? " header-sticky" : ""}`}
    >
      <div className="header-inner_wrap position-relative">
        <div className="br-line fake-class bg-white_10 bottom-0 d-none d-xl-flex" />
        <div className="container-full">
          <div className="header-inner">
            <div className="box-open-menu-mobile d-xl-none">
              <a
                href="#mobileMenu"
                data-bs-toggle="offcanvas"
                className="btn-open-menu text-white"
              >
                <i className="icon icon-List" />
              </a>
            </div>
            <div className="header-left d-none d-xl-block">
              <div className="tf-list">
                <a href="tel:0112348888" className="text-white link">
                  (+01) 1234 8888
                </a>
                <Link
                  href={`/our-store`}
                  className="text-decoration-underline text-white link"
                >
                  Our Store
                </Link>
                <Link href={`/contact`} className="text-white link">
                  Contact
                </Link>
              </div>
            </div>
            <div className="header-center">
              <Link href={`/home-pet-care`} className="logo-site">
                <Image
                  loading="lazy"
                  width={150}
                  height={30}
                  src="/assets/images/logo/logo-white.svg"
                  alt="Image"
                />
              </Link>
            </div>
            <div className="header-right">
              <div className="tf-list list-currenci d-none d-xxl-flex">
                <div className="tf-currencies">
                  <CurrencySelect textColor="color-white" />
                </div>
                <div className="tf-languages">
                  <LanguageSelect textColor="color-white" />
                </div>
              </div>
              <div className="br-line type-vertical bg-white_10 d-none d-xxl-flex" />
              <ul className="nav-icon-list">
                <li className="d-none d-sm-block">
                  <a
                    href="#search"
                    data-bs-toggle="modal"
                    className="nav-icon-item text-white link"
                  >
                    <i className="icon icon-MagnifyingGlass" />
                  </a>
                </li>
                <li>
                  <a
                    href="#sign"
                    data-bs-toggle="modal"
                    className="nav-icon-item text-white link"
                  >
                    <i className="icon icon-User" />
                  </a>
                </li>
                <li className="d-none d-sm-block">
                  <Link
                    href={`/wishlist`}
                    className="nav-icon-item text-white link"
                  >
                    <i className="icon icon-HeartStraight" />
                  </Link>
                </li>
                <li>
                  <a
                    href="#shoppingCart"
                    data-bs-toggle="offcanvas"
                    className="nav-icon-item text-white link shop-cart"
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
      <div className="header-bottom_wrap d-none d-xl-block">
        <div className="container">
          <div className="header-bottom">
            <nav className="box-navigation style-white">
              <ul className="box-nav-menu justify-content-center">
                <Nav variant2 />
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
