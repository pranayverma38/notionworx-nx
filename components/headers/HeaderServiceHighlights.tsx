"use client";

import TfSwiper from "@/components/ui/TfSwiper";

type HeaderHighlight = {
  icon: string;
  title: string;
  text: string;
  titleHref?: string;
  textHref?: string;
};

const headerHighlights: HeaderHighlight[] = [
  {
    icon: "icon-Truck2",
    title: "Free Shipping Nationwide",
    text: "For all orders over $250",
  },
  {
    icon: "icon-Headset",
    title: "+1(800) 973-9383",
    text: "orders@notionworx.com",
    titleHref: "tel:+18009739383",
    textHref: "mailto:orders@notionworx.com",
  },
  {
    icon: "icon-NotePencil",
    title: "Free Custom Design",
    text: "Elevate Your Brand",
  },
  {
    icon: "icon-ShieldCheck",
    title: "Secure Payments",
    text: "Fast, safe, and encrypted checkout every time.",
  },
];

function HighlightText({
  content,
  href,
  className,
}: {
  content: string;
  href?: string;
  className: string;
}) {
  if (!href) {
    return <span className={className}>{content}</span>;
  }

  return (
    <a href={href} className={`${className} link`}>
      {content}
    </a>
  );
}

export default function HeaderServiceHighlights({
  compact = false,
}: {
  compact?: boolean;
}) {
  const renderHighlight = (item: HeaderHighlight) => (
    <div className="service-item" key={item.title}>
      <div className="service-icon">
        <i className={`icon ${item.icon}`} />
      </div>
      <div className="service-content">
        <HighlightText
          content={item.title}
          href={item.titleHref}
          className="service-title"
        />
        <HighlightText
          content={item.text}
          href={item.textHref}
          className="service-text"
        />
      </div>
    </div>
  );

  if (compact) {
    return (
      <TfSwiper
        mobile={1}
        mobileSm={1}
        tablet={1}
        preview={1}
        laptop={1}
        auto
        delay={2000}
        speed={700}
        loop
        paginationDisabled
        className="header-service-highlights-slider"
      >
        {headerHighlights.map((item) => (
          <div className="header-service-highlight-slide" key={item.title}>
            {renderHighlight(item)}
          </div>
        ))}
      </TfSwiper>
    );
  }

  return (
    <div className="header-service-highlights">
      {headerHighlights.map(renderHighlight)}
    </div>
  );
}
