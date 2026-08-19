"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ACCOUNT_NAV_ITEMS } from "./accountNav";

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <div className="sidebar-account-wrap sidebar-content-wrap sticky-top d-lg-block d-none">
      <nav className="my-account-nav" aria-label="Account">
        {ACCOUNT_NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`link-account${active ? " active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <i className={`icon ${item.icon}`} />
              <span className="text h6 fw-medium">{item.label}</span>
            </Link>
          );
        })}
        <Link href="/login" className="link-account">
          <i className="icon icon-SignOut" />
          <span className="text h6 fw-medium">Logout</span>
        </Link>
      </nav>
    </div>
  );
}
