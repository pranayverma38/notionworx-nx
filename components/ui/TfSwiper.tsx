"use client";

import React, { useId, useMemo, useSyncExternalStore } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  Grid,
  EffectFade,
  EffectCube,
  EffectCoverflow,
} from "swiper/modules";

export interface TfSwiperProps {
  /** Slides per view at 1600+ (laptop). Default 1 */
  laptop?: number;
  /** Slides per view at 1200+. Default 1 */
  preview?: number;
  /** Slides per view at 768+. Default 1 */
  tablet?: number;
  /** Slides per view at 575+. Default same as mobile */
  mobileSm?: number;
  /** Slides per view &lt; 575. Default 1 */
  mobile?: number;
  /** spaceBetween &lt; 768. Default 0 */
  space?: number;
  /** spaceBetween 768–1199. Default 0 */
  spaceMd?: number;
  /** spaceBetween 1200+. Default 0 */
  spaceLg?: number;
  /** spaceBetween 1600+. Default same as spaceLg */
  spaceXxl?: number;
  /** slidesPerGroup &lt; 575. Default 1 */
  pagination?: number;
  /** slidesPerGroup 575–767. Default 1 */
  paginationSm?: number;
  /** slidesPerGroup 768–1199. Default 1 */
  paginationMd?: number;
  /** slidesPerGroup 1200+. Default 1 */
  paginationLg?: number;
  /** Grid rows. Default 1 */
  grid?: number;
  /** grabCursor. Default false */
  cursor?: boolean;
  /** loop. Default false */
  loop?: boolean;
  /** loop at 768+. Default false */
  loopMd?: boolean;
  /** effect: 'slide' | 'fade' | 'cube' | 'coverflow'. Default 'slide' */
  effect?: "slide" | "fade" | "cube" | "coverflow";
  /** autoplay. Default false */
  auto?: boolean;
  /** speed (ms). Default 800 */
  speed?: number;
  /** autoplay delay (ms). Default 1000 */
  delay?: number;
  /** direction. Default 'horizontal' */
  direction?: "horizontal" | "vertical";
  /** centeredSlides. Default false */
  center?: boolean;
  /** initialSlide index. Default 0 */
  init?: number;
  /** touch events. Default true */
  touch?: boolean;
  /** Use fraction pagination (e.g. 1/6). Default false */
  paginationTypeFraction?: boolean;
  /** Extra class on the swiper container */
  className?: string;
  /** Pagination wrapper class (Swiper injects bullets into this element). Default "sw-line-default style-2 tf-sw-pagination" */
  paginationClassName?: string;
  /** Navigation: render prev/next outside (e.g. in parent). If true, parent must have .nav-prev-swiper / .nav-next-swiper */
  useExternalNav?: boolean;
  /** Use nav buttons outside this swiper; selectors for next/prev (e.g. ".tf-btn-swiper-main .nav-next-swiper") */
  externalNavSelectors?: { nextEl: string; prevEl: string };
  /** Extra class on each SwiperSlide (e.g. responsive visibility). Use a string for all slides, or an array per slide index. */
  slideClassName?: string | string[];
  /** Swiper content: each child becomes a SwiperSlide */
  children: React.ReactNode;
  /** Rendered after the inner Swiper, still inside the outer `.swiper.tf-swiper` (e.g. fraction nav + prev/next). */
  footerSlot?: React.ReactNode;
  /** Swiper instance when ready (e.g. `slideTo` from parent). */
  onSwiper?: (swiper: SwiperType) => void;
  /** Callback when slide changes. */
  onSlideChange?: (swiper: SwiperType) => void;
  /**
   * When true, Swiper only mounts at `(max-width: mobileOnlyMaxWidth)`.
   * Above that, children render in a static wrapper (matches legacy `.tf-sw-mobile` + `data-screen`).
   */
  mobileOnly?: boolean;
  /** Pixel width for mobile-only breakpoint. Default 767 */
  mobileOnlyMaxWidth?: number;
  /** Classes on the static wrapper when viewport is wider than `mobileOnlyMaxWidth` */
  mobileOnlyFallbackClassName?: string;
  /** Number of slides to clone on each side for loop. */
  loopAdditionalSlides?: number;
  /** Disable pagination entirely for this swiper. */
  paginationDisabled?: boolean;
}

const defaultProps: Required<
  Omit<
    TfSwiperProps,
    | "className"
    | "paginationClassName"
    | "useExternalNav"
    | "externalNavSelectors"
    | "slideClassName"
    | "children"
    | "footerSlot"
    | "onSwiper"
    | "onSlideChange"
    | "spaceXxl"
    | "loopMd"
    | "mobileOnly"
    | "mobileOnlyMaxWidth"
    | "mobileOnlyFallbackClassName"
    | "loopAdditionalSlides"
    | "paginationDisabled"
  >
> &
  Pick<
    TfSwiperProps,
    | "className"
    | "paginationClassName"
    | "useExternalNav"
    | "externalNavSelectors"
    | "spaceXxl"
    | "loopMd"
  > = {
  laptop: 1,
  preview: 1,
  tablet: 1,
  mobileSm: 1,
  mobile: 1,
  space: 0,
  spaceMd: 0,
  spaceLg: 0,
  spaceXxl: undefined,
  pagination: 1,
  paginationSm: 1,
  paginationMd: 1,
  paginationLg: 1,
  grid: 1,
  cursor: false,
  loop: false,
  loopMd: false,
  effect: "slide",
  auto: false,
  speed: 800,
  delay: 1000,
  direction: "horizontal",
  center: false,
  init: 0,
  touch: true,
  paginationTypeFraction: false,
  className: "",
  useExternalNav: false,
};

export function TfSwiper(props: TfSwiperProps) {
  const {
    laptop = defaultProps.laptop,
    preview = defaultProps.preview,
    tablet = defaultProps.tablet,
    mobileSm = defaultProps.mobileSm,
    mobile = defaultProps.mobile,
    space: spaceProp,
    spaceMd: spaceMdProp,
    spaceLg: spaceLgProp,
    spaceXxl = defaultProps.spaceXxl,
    pagination: perGroup = defaultProps.pagination,
    paginationSm: perGroupSm = defaultProps.paginationSm,
    paginationMd: perGroupMd = defaultProps.paginationMd,
    paginationLg: perGroupLg = defaultProps.paginationLg,
    grid: gridRows = defaultProps.grid,
    cursor: cursorType = defaultProps.cursor,
    loop = defaultProps.loop,
    effect = defaultProps.effect,
    auto: atPlay = defaultProps.auto,
    speed = defaultProps.speed,
    delay = defaultProps.delay,
    direction = defaultProps.direction,
    center: centered = defaultProps.center,
    init = defaultProps.init,
    touch = defaultProps.touch,
    paginationTypeFraction = defaultProps.paginationTypeFraction,
    className = "",
    paginationClassName = "sw-line-default style-2 tf-sw-pagination",
    slideClassName,
    useExternalNav = defaultProps.useExternalNav,
    externalNavSelectors,
    footerSlot,
    onSwiper,
    onSlideChange,
    mobileOnly = false,
    mobileOnlyMaxWidth = 767,
    mobileOnlyFallbackClassName = "",
    children,
    loopAdditionalSlides,
    paginationDisabled = false,
  } = props;

  const mobileOnlyQuery = useMemo(
    () => `(max-width: ${mobileOnlyMaxWidth}px)`,
    [mobileOnlyMaxWidth],
  );

  const isMobileViewport = useSyncExternalStore(
    (onStoreChange) => {
      if (!mobileOnly || typeof window === "undefined") {
        return () => {};
      }
      const mq = window.matchMedia(mobileOnlyQuery);
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => (mobileOnly ? window.matchMedia(mobileOnlyQuery).matches : true),
    () => (mobileOnly ? false : true),
  );

  const swiperId = useId().replace(/:/g, "");
  const paginationElSelector = `#tf-swiper-${swiperId} .tf-sw-pagination`;
  const isExternalPaginationSelector = Boolean(
    paginationClassName &&
    (paginationClassName.startsWith(".") ||
      paginationClassName.startsWith("#")),
  );

  // Spacing fallbacks (match jQuery: single value fills others; spaceXxl defaults from spaceLg).
  // Use raw props for branching — defaulting spaceMd/spaceLg in destructuring broke "only space={n}".
  const spacingResolved =
    spaceProp !== undefined &&
    spaceMdProp === undefined &&
    spaceLgProp === undefined
      ? { space: spaceProp, spaceMd: spaceProp, spaceLg: spaceProp }
      : spaceProp === undefined &&
          spaceMdProp !== undefined &&
          spaceLgProp === undefined
        ? { space: 0, spaceMd: spaceMdProp, spaceLg: spaceMdProp }
        : {
            space: spaceProp ?? defaultProps.space,
            spaceMd: spaceMdProp ?? defaultProps.spaceMd,
            spaceLg: spaceLgProp ?? defaultProps.spaceLg,
          };
  const spaceLgResolved = spacingResolved.spaceLg;
  const spaceXxlVal = spaceXxl ?? spaceLgResolved;

  const modules = useMemo(() => {
    const m = [Pagination, Grid];
    if (effect === "fade") m.push(EffectFade);
    if (effect === "cube") m.push(EffectCube);
    if (effect === "coverflow") m.push(EffectCoverflow);
    if (atPlay) m.push(Autoplay);
    if (externalNavSelectors || useExternalNav) m.push(Navigation);
    return m;
  }, [effect, atPlay, externalNavSelectors, useExternalNav]);

  const paginationConfig = useMemo(
    () =>
      paginationTypeFraction
        ? {
            type: "fraction" as const,
            el: (() => {
              if (!paginationClassName) return paginationElSelector;
              const normalized = paginationClassName.trim();
              // If multiple classes are passed, selector is invalid for `el`.
              // Fallback to component-scoped pagination container in that case.
              if (normalized.includes(" ")) return paginationElSelector;
              if (normalized.startsWith(".") || normalized.startsWith("#")) {
                return normalized;
              }
              return `.${normalized}`;
            })(),
            renderFraction: (prev: string, next: string) =>
              `<span class="${prev}"></span><span class="swiper-slice"></span> <span class="${next}"></span>`,
          }
        : {
            el: isExternalPaginationSelector
              ? paginationClassName
              : paginationElSelector,
            clickable: true,
            bulletClass: "swiper-pagination-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active",
          },
    [
      paginationTypeFraction,
      paginationClassName,
      paginationElSelector,
      isExternalPaginationSelector,
    ],
  );

  const { space: s, spaceMd: sMd, spaceLg: sLg } = spacingResolved;

  const breakpoints = useMemo(
    () => ({
      575: {
        slidesPerView: mobileSm,
        spaceBetween: s,
        slidesPerGroup: perGroupSm,
        grid: { rows: gridRows, fill: "row" as const },
      },
      768: {
        slidesPerView: tablet,
        spaceBetween: sMd,
        slidesPerGroup: perGroupMd,
        grid: { rows: gridRows, fill: "row" as const },
      },
      1200: {
        slidesPerView: preview,
        spaceBetween: sLg,
        slidesPerGroup: perGroupLg,
        grid: { rows: gridRows, fill: "row" as const },
      },
      1600: {
        slidesPerView: laptop === 1 ? preview : laptop,
        spaceBetween: spaceXxlVal === 1 ? sLg : spaceXxlVal,
        slidesPerGroup: perGroupLg,
        grid: { rows: gridRows, fill: "row" as const },
      },
    }),
    [
      mobileSm,
      tablet,
      preview,
      laptop,
      s,
      sMd,
      sLg,
      spaceXxlVal,
      perGroupSm,
      perGroupMd,
      perGroupLg,
      gridRows,
    ],
  );

  const slides = React.Children.toArray(children).filter(Boolean);

  const navigationConfig =
    externalNavSelectors ??
    (useExternalNav
      ? {
          prevEl: ".tf-btn-swiper-main .nav-prev-swiper",
          nextEl: ".tf-btn-swiper-main .nav-next-swiper",
        }
      : undefined);

  if (mobileOnly && !isMobileViewport) {
    return (
      <div
        className={`tf-swiper-mobile-fallback ${mobileOnlyFallbackClassName}`.trim()}
      >
        {slides}
      </div>
    );
  }

  return (
    <div
      id={`tf-swiper-${swiperId}`}
      dir="ltr"
      className={`swiper tf-swiper ${className}`.trim()}
    >
      <Swiper
        modules={modules}
        direction={direction}
        speed={speed}
        centeredSlides={centered}
        slidesPerView={mobile}
        spaceBetween={s}
        slidesPerGroup={perGroup}
        grabCursor={cursorType}
        loop={loop}
        effect={effect}
        initialSlide={init}
        allowTouchMove={touch}
        touchStartPreventDefault
        autoplay={
          atPlay
            ? {
                delay,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        grid={{ rows: gridRows, fill: "row" }}
        pagination={paginationDisabled ? false : paginationConfig}
        breakpoints={breakpoints}
        navigation={navigationConfig}
        observer
        observeParents
        onSwiper={onSwiper}
        onSlideChange={onSlideChange}
        loopAdditionalSlides={loopAdditionalSlides}
        className="tf-swiper-inner"
      >
        {slides.map((child, index) => {
          const slideExtra =
            slideClassName === undefined
              ? undefined
              : Array.isArray(slideClassName)
                ? slideClassName[index]
                : slideClassName;
          return (
            <SwiperSlide key={index} className={slideExtra}>
              {child}
            </SwiperSlide>
          );
        })}
      </Swiper>
      {footerSlot}
      {/* Pagination wrapper: Swiper injects bullets into this element (el in pagination config) */}
      {!paginationDisabled &&
        !paginationTypeFraction &&
        !isExternalPaginationSelector && (
          <div className={`${paginationClassName} tf-sw-pagination`.trim()} />
        )}
    </div>
  );
}

export default TfSwiper;
