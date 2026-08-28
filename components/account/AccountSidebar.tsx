"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { ACCOUNT_NAV_ITEMS } from "./accountNav";
import { useAuth } from "@/context/AuthContext";

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  async function handleLogout() {
    await signOut();
    router.push("/login");
  }

  return (
    <div className="sidebar-account-wrap sidebar-content-wrap sticky-top d-lg-block d-none">
      {user && (
        <div className="px-3 pb-3 border-bottom mb-3">
          <p className="text-caption-01 cl-text-2 mb-0">Signed in as</p>
          <p className="fw-semibold mb-0" style={{ fontSize: "0.9rem", wordBreak: "break-all" }}>
            {user.email}
          </p>
        </div>
      )}
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
        <button
          onClick={handleLogout}
          className="link-account border-0 bg-transparent w-100 text-start"
          style={{ cursor: "pointer" }}
        >
          <i className="icon icon-SignOut" />
          <span className="text h6 fw-medium">Logout</span>
        </button>
      </nav>
    </div>
  );
}
