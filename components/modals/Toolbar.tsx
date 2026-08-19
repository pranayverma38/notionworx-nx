import Link from "next/link";

import WishlistButton from "../common/WishlistButton";
import CartIconCount from "../headers/CartIconCount";

export default function Toolbar() {
  return (
    <div className="tf-toolbar-bottom">
      <div className="toolbar-item">
        <Link href={`/shop-default`}>
          <span className="toolbar-icon">
            <i className="icon icon-storefront" />
          </span>
          <span className="toolbar-label">Shop</span>
        </Link>
      </div>
      <div className="toolbar-item">
        <a href="#search" data-bs-toggle="modal">
          <span className="toolbar-icon">
            <i className="icon icon-MagnifyingGlass" />
          </span>
          <span className="toolbar-label">Search</span>
        </a>
      </div>
      <div className="toolbar-item">
        <Link href={`/account-page`}>
          <span className="toolbar-icon">
            <i className="icon icon-User" />
          </span>
          <span className="toolbar-label">Account</span>
        </Link>
      </div>
      <div className="toolbar-item">
        <WishlistButton variant="toolbar" />
      </div>
      <div className="toolbar-item">
        <Link href={`/view-cart`}>
          <span className="toolbar-icon">
            <i className="icon icon-Handbag" />
            <CartIconCount className="toolbar-count" />
          </span>
          <span className="toolbar-label">Cart</span>
        </Link>
      </div>
    </div>
  );
}
