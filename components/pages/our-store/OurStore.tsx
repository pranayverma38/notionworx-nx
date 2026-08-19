import Image from "next/image";
import Link from "next/link";
import { categoriesCollection } from "@/data/categories";

const featuredNames = [
  "10x10 Custom Canopies",
  "10x15 Custom Canopies",
  "10x20 Custom Canopies",
  "FLAGS",
  "APPAREL",
  "BANNERS & DISPLAYS",
] as const;

const featuredCollections = featuredNames
  .map((name) => categoriesCollection.find((category) => category.name === name))
  .filter((category): category is NonNullable<typeof category> => Boolean(category));

export default function OurStore() {
  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        <div className="tf-grid-layout sm-col-2 xl-col-3 flat-spacing-2 pb-0">
          {featuredCollections.map((collection) => (
            <div key={collection.name} className="card-store hover-img4">
              <div className="store-image img-style4">
                <Image
                  loading="lazy"
                  width={450}
                  height={338}
                  src={collection.img}
                  alt={collection.name}
                />
              </div>
              <div className="store-infor">
                <h5 className="info_name">{collection.name}</h5>
                <ul className="list-info d-grid gap-4">
                  <li>
                    <span className="cl-text-2">Catalog Coverage:</span>
                    <span>{collection.quantity ?? "Available now"}</span>
                  </li>
                  <li>
                    <span className="cl-text-2">Use Case:</span>
                    <span>
                      {collection.name.includes("Canopies")
                        ? "Outdoor activations, trade shows, and branded tents."
                        : collection.name === "FLAGS"
                          ? "Feather flags, blade flags, and event signage."
                          : collection.name === "APPAREL"
                            ? "Team wear, uniforms, and branded merchandise."
                            : "Display walls, booth kits, and event merchandising."}
                    </span>
                  </li>
                </ul>
                <Link
                  href={collection.href ?? "/shop-default"}
                  className="d-inline-flex align-items-center gap-4 link"
                >
                  <span className="text-decoration-underline fw-medium lh-24">
                    View collection
                  </span>
                  <i className="icon icon-ArrowUpRight1 fs-20" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
