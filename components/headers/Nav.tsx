import Image from "next/image";
import Link from "next/link";
import {
  navHomeLinks,
  navShop,
  navProduct,
  navBlog,
  navPages,
} from "@/data/nav";
import { topPicsProducts } from "@/data/products/products";
import ProductCard from "@/components/ui/ProductCard";
import TfSwiper from "@/components/ui/TfSwiper";

export default function Nav({
  variant2 = false,
  variant3 = false,
}: {
  variant2?: boolean;
  variant3?: boolean;
}) {
  return (
    <>
      <li className="menu-item position-relative">
        <a href="#" className="item-link">
          <span className="text cus-text"> Home </span>
          <i className="icon icon-CaretDown" aria-hidden />
        </a>
        <div
          className={`sub-menu mega-menu_home_v2${variant2 ? " home-type_2" : ""}${variant3 ? " home-type_3" : ""}`}
        >
          {navHomeLinks.map((column, colIndex) => (
            <ul key={colIndex} className="sub-menu_list">
              {column.map((item) => (
                <li key={item.href + item.text}>
                  <Link href={item.href} className="sub-menu_link has-text">
                    <span className="cus-text"> {item.text} </span>
                    {item.label != null && (
                      <span className={`demo-label type-${item.label}`}>
                        {item.label === "hot"
                          ? "Hot"
                          : item.label === "new"
                            ? "New"
                            : "Trend"}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
          <div className="image-preview">
            <Image
              src="/assets/images/section/amerce-html.jpg"
              alt=""
              width={300}
              height={264}
              loading="lazy"
            />
          </div>
        </div>
      </li>
      <li className="menu-item">
        <a href="#" className="item-link">
          <span className="text cus-text"> Shop </span>
          <i className="icon icon-CaretDown" />
        </a>
        <div className="sub-menu mega-menu">
          <div className="container-full">
            <div className="row">
              {navShop.map((column, index) => (
                <div className="col-2" key={index}>
                  <div className="mega-menu-item menu-lv-2">
                    <p className="menu-heading">{column.title}</p>
                    <ul className="sub-menu_list">
                      {column.links.map((link, i) => (
                        <li key={i}>
                          <Link
                            href={link.href}
                            className="sub-menu_link has-text"
                          >
                            <span className="cus-text"> {link.text} </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              <div className="col-4">
                <div className="box-image_v01 style-2 h-100">
                  <Link
                    href="/shop-default"
                    className="box-image_img img-style"
                  >
                    <Image
                      src="/assets/images/collection/cls-7.jpg"
                      alt=""
                      width={700}
                      height={461}
                      loading="lazy"
                    />
                  </Link>
                  <div className="box-image_content">
                    <Link
                      href="/shop-default"
                      className="title h3 fw-medium text-white link-underline-white text-decoration-thickness"
                    >
                      Shop Men
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li className="menu-item">
        <a href="#" className="item-link">
          <span className="text cus-text"> Product </span>
          <i className="icon icon-CaretDown" />
        </a>
        <div className="sub-menu mega-menu">
          <div className="container-full">
            <div className="row">
              {navProduct.map((column, index) => (
                <div
                  className={`col-2 ${index === 0 ? "ms-auto" : ""}`}
                  key={index}
                >
                  <div className="mega-menu-item menu-lv-2">
                    <p className="menu-heading">{column.title}</p>
                    <ul className="sub-menu_list">
                      {column.links.map((link, i) => (
                        <li key={i}>
                          <Link
                            href={link.href}
                            className="sub-menu_link has-text"
                          >
                            <span className="cus-text"> {link.text} </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              <div className="col-4 me-auto">
                <TfSwiper
                  preview={2}
                  tablet={2}
                  mobileSm={2}
                  mobile={2}
                  space={10}
                  pagination={2}
                  paginationSm={2}
                  paginationMd={2}
                  paginationLg={2}
                  paginationClassName="sw-dot-default tf-sw-pagination"
                >
                  {topPicsProducts.map((product) => (
                    <ProductCard
                      key={product.img}
                      product={product}
                      actionBotLabel="Quick Add"
                      actionBotDataToggle="modal"
                    />
                  ))}
                </TfSwiper>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li className="menu-item position-relative">
        <a href="#" className="item-link">
          <span className="text cus-text"> Blog </span>
          <i className="icon icon-CaretDown" />
        </a>
        <div className="sub-menu mega-menu-item">
          <ul className="sub-menu_list">
            {navBlog.map((link, index) => (
              <li key={index}>
                <Link href={link.href} className="sub-menu_link has-text">
                  <span className="cus-text"> {link.text} </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </li>
      <li className="menu-item position-relative">
        <a href="#" className="item-link">
          <span className="text cus-text"> Pages </span>
          <i className="icon icon-CaretDown" />
        </a>
        <div className="sub-menu mega-menu-item">
          <ul className="sub-menu_list">
            {navPages.map((link, index) => (
              <li key={index}>
                <Link href={link.href} className="sub-menu_link has-text">
                  <span className="cus-text"> {link.text} </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </li>
      <li className="menu-item d-none d-xxl-block">
        <a
          href="https://themeforest.net/user/themesflat/portfolio"
          target="_blank"
          className="item-link"
        >
          <span className="text cus-text"> Buy Template </span>
        </a>
      </li>
    </>
  );
}
