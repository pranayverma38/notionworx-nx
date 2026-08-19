import Link from "next/link";

import {
  navBlog,
  navHomeLinks,
  navPages,
  navProduct,
  navShop,
} from "@/data/nav";

function DemoLabel({ label }: { label: "hot" | "new" | "trend" }) {
  return (
    <span className={`demo-label type-${label}`}>
      {label === "hot" ? "Hot" : label === "new" ? "New" : "Trend"}
    </span>
  );
}

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
                    {item.label != null && <DemoLabel label={item.label} />}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </li>

      <li className="menu-item">
        <a href="#" className="item-link">
          <span className="text cus-text"> Shop </span>
          <i className="icon icon-CaretDown" aria-hidden />
        </a>
        <div className="sub-menu mega-menu">
          <div className="container-full">
            <div className="row">
              {navShop.map((column) => (
                <div className="col-3" key={column.title}>
                  <div className="mega-menu-item menu-lv-2">
                    <p className="menu-heading">{column.title}</p>
                    <ul className="sub-menu_list">
                      {column.links.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} className="sub-menu_link has-text">
                            <span className="cus-text"> {link.text} </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </li>

      <li className="menu-item">
        <a href="#" className="item-link">
          <span className="text cus-text"> Product </span>
          <i className="icon icon-CaretDown" aria-hidden />
        </a>
        <div className="sub-menu mega-menu">
          <div className="container-full">
            <div className="row">
              {navProduct.map((column) => (
                <div className="col-3" key={column.title}>
                  <div className="mega-menu-item menu-lv-2">
                    <p className="menu-heading">{column.title}</p>
                    <ul className="sub-menu_list">
                      {column.links.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} className="sub-menu_link has-text">
                            <span className="cus-text"> {link.text} </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </li>

      {navBlog.length > 0 && (
        <li className="menu-item position-relative">
          <a href="#" className="item-link">
            <span className="text cus-text"> Blog </span>
            <i className="icon icon-CaretDown" aria-hidden />
          </a>
          <div className="sub-menu mega-menu-item">
            <ul className="sub-menu_list">
              {navBlog.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="sub-menu_link has-text">
                    <span className="cus-text"> {link.text} </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </li>
      )}

      <li className="menu-item position-relative">
        <a href="#" className="item-link">
          <span className="text cus-text"> Pages </span>
          <i className="icon icon-CaretDown" aria-hidden />
        </a>
        <div className="sub-menu mega-menu-item">
          <ul className="sub-menu_list">
            {navPages.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="sub-menu_link has-text">
                  <span className="cus-text"> {link.text} </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </li>
    </>
  );
}
