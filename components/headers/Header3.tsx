"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Nav from "./Nav";
import { useHeaderSticky } from "@/hooks/useHeaderSticky";
import CartIconCount from "./CartIconCount";

export default function Header3() {
  const router = useRouter();
  const headerSticky = useHeaderSticky();
  const [query, setQuery] = useState("");

  return (
    <header
      style={{
        top: headerSticky ? "0px" : "-150px",
        transition: "top 0.3s ease-in-out",
      }}
      className={`tf-header header-s4 scr-box-shadow${headerSticky ? " header-sticky" : ""}`}
    >
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
            <div className="header-left d-none d-xl-block">
              <form
                className="form-search-nav style-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = query.trim();
                  router.push(
                    q
                      ? `/search-result?query=${encodeURIComponent(q)}`
                      : "/search-result",
                  );
                }}
              >
                <fieldset>
                  <input
                    type="text"
                    placeholder="Search Products"
                    required
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </fieldset>
                <button type="submit" className="btn-action">
                  <i className="icon icon-MagnifyingGlass" />
                </button>
              </form>
            </div>
            <div className="header-center">
              <Link href={`/home-pod`} className="logo-site">
                <Image
                  loading="lazy"
                  width={150}
                  height={30}
                  src="/assets/images/logo/logo.svg"
                  alt="Image"
                />
              </Link>
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
      <div className="header-bottom_wrap d-none d-xl-block">
        <div className="container">
          <div className="header-bottom">
            <nav className="box-navigation">
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
