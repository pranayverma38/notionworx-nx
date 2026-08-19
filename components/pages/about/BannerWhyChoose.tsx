import Image from "next/image";

const accordionItems = [
  {
    id: "faq-1",
    title: "Introduction",
    body: "Notion Worx now presents its core storefront through a local inventory layer, making the catalog easier to manage while keeping product discovery aligned across homepage, collection, shop, and product detail routes.",
  },
  {
    id: "faq-2",
    title: "Our Vision",
    body: "Create a cleaner event-merchandising experience where tents, displays, flags, apparel, and accessories all feel like part of one purposeful storefront instead of a stitched-together template.",
  },
  {
    id: "faq-3",
    title: "What Sets Us Apart",
    body: "The migrated catalog relies on mirrored assets and structured product data, which means featured sections, navigation, search, and merchandising blocks can all pull from the same local source of truth.",
  },
  {
    id: "faq-4",
    title: "Our Commitment",
    body: "Keep the customer-facing experience focused on real Notion Worx products and categories, with maintainable routing and minimal demo-era leftovers in the live storefront flow.",
  },
] as const;

export default function BannerWhyChoose() {
  return (
    <section className="themesFlat">
      <div className="container">
        <div className="banner-why-choose">
          <div className="bn-image">
            <Image
              loading="lazy"
              width={640}
              height={480}
              src="/assets/images/notionworx-inventory/10x20/10x20-custom-canopy-tent-20ft-back-wall/01.jpg"
              alt="Custom canopy display"
            />
          </div>
          <div className="bn-content">
            <h3 className="mb-12">
              A streamlined storefront for branded event products
            </h3>
            <div id="accordion-v2">
              {accordionItems.map((item, index) => (
                <div key={item.id} className="accordion-item_v2">
                  <div
                    className={`accordion-action lh-24 fw-medium${index === 0 ? "" : " collapsed"}`}
                    data-bs-target={`#${item.id}`}
                    data-bs-toggle="collapse"
                    aria-expanded={index === 0}
                    aria-controls={item.id}
                    role="button"
                  >
                    <span>{item.title}</span>
                    <span className="icon ic-accordion-custom cl-2" />
                  </div>
                  <div
                    id={item.id}
                    className={`collapse${index === 0 ? " show" : ""}`}
                    data-bs-parent="#accordion-v2"
                  >
                    <p className="faq-content cl-text-2">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
