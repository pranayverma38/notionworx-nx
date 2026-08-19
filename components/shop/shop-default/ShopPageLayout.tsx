"use client";

import type { ReactNode } from "react";

import { DesktopFilterSidebar } from "./DesktopFilterSidebar";

type Sidebar = "leftSidebar" | "rightSidebar";

type Props = {
  isFullWidth: boolean;
  showDesktopSidebar: boolean;
  sidebarPlacement: Sidebar | undefined;
  children: ReactNode;
};

/**
 * Container + optional desktop facet sidebar (left or right).
 * When no sidebar, renders only the main column children.
 */
export function ShopPageLayout({
  isFullWidth,
  showDesktopSidebar,
  sidebarPlacement,
  children,
}: Props) {
  const containerClass = isFullWidth ? "container-full" : "container";

  if (!showDesktopSidebar || sidebarPlacement == null) {
    return <div className={containerClass}>{children}</div>;
  }

  if (sidebarPlacement === "leftSidebar") {
    return (
      <div className={containerClass}>
        <div className="row">
          <div className="col-xl-3">
            <DesktopFilterSidebar side="left" />
          </div>
          <div className="col-xl-9">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className="row">
        <div className="col-xl-9">{children}</div>
        <div className="col-xl-3">
          <DesktopFilterSidebar side="right" />
        </div>
      </div>
    </div>
  );
}
