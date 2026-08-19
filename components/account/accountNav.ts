/** Routes under the account area; `href` must match `usePathname()` for active nav */
export const ACCOUNT_NAV_ITEMS = [
  { href: "/account-page", label: "Dashboard", icon: "icon-HouseLine" },
  { href: "/account-orders", label: "Your Orders", icon: "icon-Package" },
  { href: "/account-addresses", label: "My Address", icon: "icon-Tag" },
  { href: "/account-setting", label: "Setting", icon: "icon-GearSix" },
] as const;
