"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const Ask = dynamic<{ registerModalElement?: (el: HTMLElement | null) => void; }>(() => import("@/components/modals/Ask").then((m) => m.default), { ssr: false });
const ForgotPass = dynamic<{ registerModalElement?: (el: HTMLElement | null) => void; }>(() => import("@/components/modals/ForgotPass").then((m) => m.default), { ssr: false });
const NewsLetter = dynamic<{ registerModalElement?: (el: HTMLElement | null) => void; }>(() => import("@/components/modals/NewsLetter").then((m) => m.default), { ssr: false });
const QuickAdd = dynamic<{ registerModalElement?: (el: HTMLElement | null) => void; }>(() => import("@/components/modals/QuickAdd").then((m) => m.default), { ssr: false });
const Register = dynamic<{ registerModalElement?: (el: HTMLElement | null) => void; }>(() => import("@/components/modals/Register").then((m) => m.default), { ssr: false });
const Search = dynamic<{ registerModalElement?: (el: HTMLElement | null) => void; }>(() => import("@/components/modals/Search").then((m) => m.default), { ssr: false });
const Share = dynamic<{ registerModalElement?: (el: HTMLElement | null) => void; }>(() => import("@/components/modals/Share").then((m) => m.default), { ssr: false });
const SignIn = dynamic<{ registerModalElement?: (el: HTMLElement | null) => void; }>(() => import("@/components/modals/SignIn").then((m) => m.default), { ssr: false });
const SizeGuide = dynamic<{ registerModalElement?: (el: HTMLElement | null) => void; }>(() => import("@/components/modals/SizeGuide").then((m) => m.default), { ssr: false });
const Cart = dynamic<{ registerOffcanvasElement?: (el: HTMLElement | null) => void; }>(() => import("@/components/modals/Cart").then((m) => m.default), { ssr: false });
const Compare = dynamic<{ registerOffcanvasElement?: (el: HTMLElement | null) => void; }>(() => import("@/components/modals/Compare").then((m) => m.default), { ssr: false });
const MobileMenu = dynamic<{ registerOffcanvasElement?: (el: HTMLElement | null) => void; }>(() => import("@/components/modals/MobileMenu").then((m) => m.default), { ssr: false });
const QuickView = dynamic<{ registerOffcanvasElement?: (el: HTMLElement | null) => void; }>(() => import("@/components/modals/QuickView").then((m) => m.default), { ssr: false });
const OrderDetails = dynamic<{ registerModalElement?: (el: HTMLElement | null) => void }>(
  () => import("@/components/modals/OrderDetails").then((m) => m.default),
  { ssr: false },
);
const Toolbar = dynamic(() => import("@/components/modals/Toolbar").then((m) => m.default), { ssr: false });

type BootstrapModalInstance = {
  hide: () => void;
};

type BootstrapOffcanvasInstance = {
  hide: () => void;
};

type BootstrapStatic = {
  Modal: {
    getOrCreateInstance(element: HTMLElement): BootstrapModalInstance;
    getInstance(element: HTMLElement): BootstrapModalInstance | null;
  };
  Offcanvas: {
    getOrCreateInstance(element: HTMLElement): BootstrapOffcanvasInstance;
    getInstance(element: HTMLElement): BootstrapOffcanvasInstance | null;
  };
};

export default function LayoutModals() {
  const pathname = usePathname();
  const modalElementsRef = useRef<HTMLElement[]>([]);
  const offcanvasElementsRef = useRef<HTMLElement[]>([]);
  const modalInstancesRef = useRef<BootstrapModalInstance[]>([]);
  const offcanvasInstancesRef = useRef<BootstrapOffcanvasInstance[]>([]);

  const registerModalElement = (el: HTMLElement | null) => {
    if (!el) return;
    if (!modalElementsRef.current.includes(el)) {
      modalElementsRef.current.push(el);
    }
  };

  const registerOffcanvasElement = (el: HTMLElement | null) => {
    if (!el) return;
    if (!offcanvasElementsRef.current.includes(el)) {
      offcanvasElementsRef.current.push(el);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    async function collectAndCloseModals() {
      if (typeof window === "undefined") return;

      const bootstrapModule = (await import("bootstrap")) as unknown as BootstrapStatic;
      if (isCancelled) return;

      const { Modal, Offcanvas } = bootstrapModule;

      modalInstancesRef.current = modalElementsRef.current
        .map((el) => Modal.getInstance(el) ?? Modal.getOrCreateInstance(el))
        .filter(
          (instance): instance is BootstrapModalInstance => instance != null,
        );
      modalInstancesRef.current.forEach((instance) => {
        try {
          instance.hide();
        } catch (error) {
           console.log("Error hiding modal:", error);
        }
      });

      offcanvasInstancesRef.current = offcanvasElementsRef.current
        .map((el) => Offcanvas.getInstance(el) ?? Offcanvas.getOrCreateInstance(el))
        .filter(
          (instance): instance is BootstrapOffcanvasInstance => instance != null,
        );
      offcanvasInstancesRef.current.forEach((instance) => {
        try {
          instance.hide();
        } catch (error) {
           console.log("Error hiding offcanvas:", error);
        }
      });
    }

    collectAndCloseModals();

    return () => {
      isCancelled = true;
    };
  }, [pathname]);

  return (
    <>
      <Ask registerModalElement={registerModalElement} />
      <ForgotPass registerModalElement={registerModalElement} />
      <NewsLetter registerModalElement={registerModalElement} />
      <OrderDetails registerModalElement={registerModalElement} />
      <QuickAdd registerModalElement={registerModalElement} />
      <Register registerModalElement={registerModalElement} />
      <Search registerModalElement={registerModalElement} />
      <Share registerModalElement={registerModalElement} />
      <SignIn registerModalElement={registerModalElement} />
      <SizeGuide registerModalElement={registerModalElement} />
      <Cart registerOffcanvasElement={registerOffcanvasElement} />
      <Compare registerOffcanvasElement={registerOffcanvasElement} />
      <MobileMenu registerOffcanvasElement={registerOffcanvasElement} />
      <QuickView registerOffcanvasElement={registerOffcanvasElement} />
    
      <Toolbar />
    </>
  );
}
