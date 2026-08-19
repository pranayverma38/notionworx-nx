"use client";

import { createContext, useContext, useEffect, useState } from "react";

const MOBILE_QUERY = "(max-width: 575px)";

type FooterAccordionContextValue = {
  isMobile: boolean;
  isOpen: (id: string) => boolean;
  toggle: (id: string) => void;
};

const FooterAccordionContext =
  createContext<FooterAccordionContextValue | null>(null);

function useFooterAccordionContext() {
  const context = useContext(FooterAccordionContext);
  if (!context) {
    throw new Error(
      "FooterAccordionItem must be used inside FooterAccordionWrapper",
    );
  }
  return context;
}

export default function FooterAccordionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const sync = () => setIsMobile(mediaQuery.matches);
    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  const toggle = (id: string) => {
    if (!isMobile) return;
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const contextValue: FooterAccordionContextValue = {
    isMobile,
    isOpen: (id: string) => Boolean(openMap[id]),
    toggle,
  };

  return (
    <FooterAccordionContext.Provider value={contextValue}>
      {children}
    </FooterAccordionContext.Provider>
  );
}

export function FooterAccordionItem({
  id,
  className,
  heading,
  headingClassName,
  children,
}: {
  id: string;
  className: string;
  heading: React.ReactNode;
  headingClassName: string;
  children: React.ReactNode;
}) {
  const { isMobile, isOpen, toggle } = useFooterAccordionContext();
  const open = isMobile && isOpen(id);

  return (
    <div className={`${className} ${open ? "open" : ""}`.trim()}>
      <button
        type="button"
        className={`${headingClassName} border-0 bg-transparent p-0 w-100 text-start`}
        aria-controls={id}
        aria-expanded={isMobile ? open : true}
        onClick={() => toggle(id)}
      >
        {heading}
      </button>
      <div id={id} className="tf-collapse-content">
        {children}
      </div>
    </div>
  );
}
