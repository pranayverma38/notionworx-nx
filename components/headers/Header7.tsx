"use client";
import Link from "next/link";
import Image from "next/image";

import Nav from "./Nav";
import TfSwiper from "@/components/ui/TfSwiper";
import { useHeaderSticky } from "@/hooks/useHeaderSticky";
import BrowseByCategoryNav from "./BrowseByCategoryNav";
import CartIconCount from "./CartIconCount";

export default function Header7() {
  const headerSticky = useHeaderSticky();

  return (
    <header
      style={{
        top: headerSticky ? "0px" : "-150px",
        transition: "top 0.3s ease-in-out",
      }}
      className={`tf-header header-abs scr-box-shadow-2${headerSticky ? " header-sticky" : ""}`}
    >
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
            <div className="header-left">
              <Link href={`/home-cosmetic`} className="logo-site">
                <Image
                  loading="lazy"
                  width={150}
                  height={30}
                  src="/assets/images/logo/logo.svg"
                  alt="Image"
                />
              </Link>
              <div className="nav-category-wrap style-3 main-action-active d-none d-xxl-block">
                <BrowseByCategoryNav hasHubbergBtn={false} hasRadiusBtn />
              </div>
              <nav className="box-navigation d-none d-xl-block">
                <ul className="box-nav-menu">
                  <Nav variant2 />
                </ul>
              </nav>
            </div>
            <div className="header-right">
              <form
                className="form-search-nav style-3 d-none d-xl-block"
                onSubmit={(e) => e.preventDefault()}
              >
                <fieldset>
                  <input type="text" placeholder="Search Products" required />
                </fieldset>
                <button type="submit" className="btn-action">
                  <i className="icon icon-MagnifyingGlass" />
                </button>
              </form>
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
        </div>
      </div>
      <div
        id="header7-announcement-swiper"
        className="tf-btn-swiper-main swip-text d-none d-xl-block"
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-sm-1 ms-auto d-none d-sm-block">
              <div className="nav-prev-swiper d-flex link justify-content-end">
                <i className="icon icon-CaretLeft" aria-hidden />
              </div>
            </div>
            <div className="col-sm-10 col-md-8 col-lg-6">
              <div className="text-center">
                <TfSwiper
                  auto
                  loop
                  speed={1500}
                  delay={1500}
                  paginationClassName="d-none"
                  externalNavSelectors={{
                    prevEl: "#header7-announcement-swiper .nav-prev-swiper",
                    nextEl: "#header7-announcement-swiper .nav-next-swiper",
                  }}
                >
                  <div className="d-flex align-items-center justify-content-center gap-8">
                    <i className="icon icon-SealPercent fs-20" aria-hidden />
                    <p className="text-line-clamp-1">
                      Midseason Sale: 20% Off - Auto Applied at Checkout -
                      Limited Time Only
                    </p>
                  </div>
                  <p className="text-line-clamp-1">
                    20% Off - Auto Applied at Checkout - Limited Time Only
                  </p>
                </TfSwiper>
              </div>
            </div>
            <div className="col-sm-1 me-auto d-none d-sm-block">
              <div className="nav-next-swiper d-flex link">
                <i className="icon icon-CaretRightThin" aria-hidden />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
