"use client";
import Link from "next/link";
import Image from "next/image";

import Nav from "./Nav";
import { useHeaderSticky } from "@/hooks/useHeaderSticky";
import CartIconCount from "./CartIconCount";

export default function Header9() {
  const headerSticky = useHeaderSticky();

  return (
    <header
      style={{
        top: headerSticky ? "0px" : "-80px",
        transition: "top 0.3s ease-in-out",
      }}
      className={`tf-header header-s7 hds7-type-2 header-abs-3 scr-box-shadow${headerSticky ? " header-sticky" : ""}`}
    >
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
          <div className="header-left d-none d-xl-flex">
            <Link href={`/`} className="logo-site">
              <Image
                loading="lazy"
                width={150}
                height={30}
                src="/assets/images/logo/logo-white.svg"
                alt="Image"
              />
            </Link>
            <nav className="box-navigation style-white-2">
              <ul className="box-nav-menu">
                <Nav variant3 />
              </ul>
            </nav>
          </div>
          <div className="header-center d-xl-none">
            <Link href={`/`} className="logo-site">
              <Image
                loading="lazy"
                width={150}
                height={30}
                src="/assets/images/logo/logo-white.svg"
                alt="Image"
              />
            </Link>
          </div>
          <div className="header-right align-items-center">
            <a
              href="#search"
              data-bs-toggle="modal"
              className="btn-open-search d-none d-xxl-flex"
            >
              Search Products
              <i className="icon icon-MagnifyingGlass" />
            </a>
            <div className="br-line type-vertical h-24 d-none d-xxl-flex" />
            <ul className="nav-icon-list">
              <li>
                <a
                  href="#sign"
                  data-bs-toggle="modal"
                  className="nav-icon-item text-white link-dark"
                >
                  <i className="icon icon-User" />
                </a>
              </li>
              <li className="d-none d-sm-block">
                <Link
                  href={`/wishlist`}
                  className="nav-icon-item text-white link-dark"
                >
                  <i className="icon icon-HeartStraight" />
                </Link>
              </li>
              <li>
                <a
                  href="#shoppingCart"
                  data-bs-toggle="offcanvas"
                  className="nav-icon-item text-white link-dark shop-cart"
                >
                  <i className="icon icon-Handbag" />
                  <CartIconCount />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
