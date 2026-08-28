"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import TfSwiper from "@/components/ui/TfSwiper";
import { testimonialNotionWorxSlides } from "@/data/testimonials";

type TestimonialSlide = (typeof testimonialNotionWorxSlides)[number];

const sanitizeQuote = (quote: string) => quote.replace(/^[⭐★\s]+/u, "").trim();
const getSlideMedia = (slide: TestimonialSlide) => {
  if (slide.media != null && slide.media.length > 0) {
    return slide.media;
  }

  return slide.authorImg != null
    ? [{ src: slide.authorImg, alt: slide.authorAlt || `${slide.authorName} testimonial image` }]
    : [];
};

function Testimonials() {
  const [activeSlide, setActiveSlide] = useState<TestimonialSlide | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const openDialog = (slide: TestimonialSlide) => {
    setActiveMediaIndex(0);
    setActiveSlide(slide);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    window.setTimeout(() => {
      setActiveSlide(null);
    }, 220);
  };

  useEffect(() => {
    if (activeSlide == null) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDialog();
      }
    };

    document.body.style.overflow = "hidden";
    const openTimer = window.requestAnimationFrame(() => {
      setIsDialogOpen(true);
    });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(openTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeSlide]);

  const activeSlideMedia = activeSlide != null ? getSlideMedia(activeSlide) : [];
  const activeMedia = activeSlideMedia[activeMediaIndex] ?? activeSlideMedia[0];

  return (
    <>
      <section className="flat-spacing">
        <div className="container-2">
          <div className="sect-heading text-center wow fadeInUp">
            <h3 className="s-title">Customers are saying</h3>
            <p className="s-desc cl-text-2">4.99 ★ (87) Verified</p>
          </div>
          <TfSwiper
            preview={4}
            tablet={3}
            mobileSm={2}
            mobile={2}
            spaceLg={20}
            spaceMd={16}
            space={12}
            pagination={1}
            paginationSm={1}
            paginationMd={2}
            paginationLg={4}
            paginationClassName="sw-dot-default tf-sw-pagination"
          >
            {testimonialNotionWorxSlides.map((slide, index) => {
              const quoteText = sanitizeQuote(slide.quote);
              const slideMedia = getSlideMedia(slide);
              const previewMedia = slideMedia[0];

              return (
                <div
                  key={`notionworx-${slide.authorName}-${index}`}
                  className="testimonial-v01 style-def style-4 type-2 wow fadeInLeft d-flex flex-column h-100"
                  data-wow-delay={index > 0 ? `${index * 0.1}s` : undefined}
                  role="button"
                  tabIndex={0}
                  onClick={() => openDialog(slide)}
                  onKeyDown={event => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openDialog(slide);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className="tes-image position-relative overflow-hidden"
                    style={{ aspectRatio: "4 / 3.2", borderRadius: "16px 16px 0 0" }}
                  >
                    {previewMedia != null ? (
                      <Image
                        src={previewMedia.src}
                        alt={("alt" in previewMedia ? previewMedia.alt : undefined) || slide.authorAlt || "Testimonial image"}
                        fill
                        sizes="(max-width: 767px) 50vw, (max-width: 1199px) 33vw, 25vw"
                        style={{ objectFit: "cover", objectPosition: "center center" }}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-100 h-100"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(0, 79, 199, 0.12), rgba(0, 0, 0, 0.04))",
                        }}
                      />
                    )}
                    {slideMedia.length > 1 && (
                      <span
                        className="position-absolute text-white fw-medium"
                        style={{
                          right: "12px",
                          bottom: "12px",
                          backgroundColor: "rgba(16, 18, 24, 0.72)",
                          borderRadius: "999px",
                          fontSize: "12px",
                          lineHeight: 1,
                          padding: "8px 10px",
                        }}
                      >
                        {slideMedia.length} photos
                      </span>
                    )}
                  </div>
                  <div className="tes-content d-flex flex-column flex-grow-1">
                    <div className="star-wrap d-flex align-items-center">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="icon icon-Star fs-16" aria-hidden />
                      ))}
                    </div>
                    <p className="tes_text cl-text-2 text-line-clamp-3">{quoteText}</p>
                    <button
                      type="button"
                      className="link text-primary fw-medium text-start"
                      onClick={event => {
                        event.stopPropagation();
                        openDialog(slide);
                      }}
                      style={{
                        border: "none",
                        background: "transparent",
                        padding: 0,
                        marginTop: "4px",
                        alignSelf: "flex-start",
                      }}
                    >
                      Show more
                    </button>
                    <div className="tes_author mt-auto">
                      <p className="author-name lh-24 fw-medium">{slide.authorName}</p>
                      <div className="author-verified">
                        <i className="icon icon-CheckCircle fs-20" aria-hidden />
                        <span className="text cl-text-2">{slide.verifiedLabel || "Verified"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </TfSwiper>
        </div>
      </section>

      {activeSlide != null && (
        <div
          aria-modal="true"
          role="dialog"
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            zIndex: 1055,
            backgroundColor: "rgba(16, 18, 24, 0.7)",
            padding: "16px",
            opacity: isDialogOpen ? 1 : 0,
            transition: "opacity 220ms ease",
          }}
          onClick={closeDialog}
        >
          <div
            className="bg-white tf-grid-layout md-col-2 gap-0 overflow-hidden position-relative"
            style={{
              width: "min(100%, 1080px)",
              height: "min(90vh, 820px)",
              borderRadius: "24px",
              boxShadow: "0 24px 80px rgba(0, 0, 0, 0.18)",
              opacity: isDialogOpen ? 1 : 0,
              transform: isDialogOpen ? "translateY(0) scale(1)" : "translateY(24px) scale(0.96)",
              transition: "opacity 220ms ease, transform 260ms ease",
            }}
            onClick={event => event.stopPropagation()}
          >
            <div
              className="d-flex flex-column"
              style={{ minHeight: "280px", backgroundColor: "#f5f5f5" }}
            >
              <div className="position-relative flex-grow-1" style={{ minHeight: "280px" }}>
                {activeMedia != null ? (
                  <Image
                    src={activeMedia.src}
                    alt={(("alt" in activeMedia ? activeMedia.alt : undefined) as string | undefined) || activeSlide.authorAlt || "Testimonial image"}
                    fill
                    sizes="(max-width: 991px) 100vw, 50vw"
                    style={{ objectFit: "cover", objectPosition: "center center" }}
                    priority
                  />
                ) : (
                  <div
                    className="w-100 h-100"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(0, 79, 199, 0.12), rgba(0, 0, 0, 0.04))",
                    }}
                  />
                )}
              </div>
              {activeSlideMedia.length > 1 && (
                <div
                  className="d-flex gap-2 flex-wrap"
                  style={{
                    padding: "12px",
                    borderTop: "1px solid #e5e7eb",
                    backgroundColor: "#fff",
                  }}
                >
                  {activeSlideMedia.map((media, mediaIndex) => (
                    <button
                      key={`${activeSlide.authorName}-media-${mediaIndex}`}
                      type="button"
                      aria-label={`Show review image ${mediaIndex + 1}`}
                      onClick={() => setActiveMediaIndex(mediaIndex)}
                      style={{
                        border:
                          mediaIndex === activeMediaIndex
                            ? "2px solid #004fc7"
                            : "1px solid #d1d5db",
                        borderRadius: "12px",
                        padding: 0,
                        overflow: "hidden",
                        width: "72px",
                        height: "72px",
                        backgroundColor: "#fff",
                      }}
                    >
                      <div className="position-relative w-100 h-100">
                        <Image
                          src={media.src}
                          alt={(("alt" in media ? media.alt : undefined) as string | undefined) || `${activeSlide.authorName} testimonial image ${mediaIndex + 1}`}
                          fill
                          sizes="72px"
                          style={{ objectFit: "cover", objectPosition: "center center" }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div
              className="d-flex flex-column"
              style={{
                padding: "clamp(20px, 3vw, 36px)",
                overflow: "hidden",
                minHeight: 0,
              }}
            >
              <div
                className="d-flex align-items-start justify-content-between"
                style={{ gap: "12px" }}
              >
                <div>
                  <p
                    className="text-caption-01 text-uppercase fw-medium cl-text-3"
                    style={{ marginBottom: "8px" }}
                  >
                    Customer review
                  </p>
                  <h4 style={{ marginBottom: activeSlide.role != null ? "8px" : "12px" }}>
                    {activeSlide.authorName}
                  </h4>
                  {activeSlide.role != null && (
                    <p className="cl-text-2 mb-0" style={{ fontSize: "14px" }}>
                      {activeSlide.role}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Close testimonial popup"
                  className="link d-flex align-items-center justify-content-center"
                  onClick={closeDialog}
                  style={{
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    borderRadius: "999px",
                    width: "40px",
                    minWidth: "40px",
                    height: "40px",
                    padding: 0,
                  }}
                >
                  <i className="icon-X2 fs-20" aria-hidden />
                </button>
              </div>

              <div
                className="star-wrap d-flex align-items-center"
                style={{ marginBottom: "12px" }}
              >
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="icon icon-Star fs-18" aria-hidden />
                ))}
              </div>

              <div className="author-verified" style={{ marginBottom: "20px" }}>
                <i className="icon icon-CheckCircle fs-20" aria-hidden />
                <span className="text cl-text-2">
                  {activeSlide.verifiedLabel || "Verified customer"}
                </span>
              </div>

              <div style={{ overflowY: "auto", minHeight: 0, paddingRight: "6px" }}>
                <p className="cl-text-2 mb-0" style={{ whiteSpace: "pre-line" }}>
                  {sanitizeQuote(activeSlide.quote)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Testimonials;
