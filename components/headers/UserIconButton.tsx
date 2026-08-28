"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * User icon in all headers.
 * - Logged in  → shows icon + hover dropdown (account links + logout)
 * - Logged out → opens #sign modal
 */
export default function UserIconButton() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  if (!loading && user) {
    return (
      <div className="nav-account d-block" style={{ position: "relative" }}>
        <a href="/account-page" className="nav-icon-item link" title={user.email ?? "My Account"}>
          <i className="icon icon-User" />
        </a>
        <div className="dropdown-account">
          <ul className="list-menu-item">
            <li>
              <Link href="/account-page" className="sub-menu_link">My Account</Link>
            </li>
            <li>
              <Link href="/account-orders" className="sub-menu_link">Your Orders</Link>
            </li>
            <li>
              <Link href="/account-addresses" className="sub-menu_link">My Addresses</Link>
            </li>
            <li>
              <Link href="/account-setting" className="sub-menu_link">Settings</Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="sub-menu_link border-0 bg-transparent p-0 w-100 text-start"
                style={{ cursor: "pointer" }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <a
      href="#sign"
      data-bs-toggle="modal"
      className="nav-icon-item link"
      aria-label="Sign in"
    >
      <i className="icon icon-User" />
    </a>
  );
}
