import Link from "next/link";
import Image from "next/image";
import { categoriesCollection } from "@/data/categories";

const featuredCollections = [
  "10x10 Custom Canopies",
  "FLAGS",
  "BANNERS & DISPLAYS",
];

function getCollection(name: string) {
  return categoriesCollection.find((category) => category.name === name);
}

function CollectionCard({
  href,
  img,
  name,
  width,
  height,
  className = "",
}: {
  href: string;
  img: string;
  name: string;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <div className={`box-image_v01 ${className}`.trim()}>
      <Link href={href} className="box-image_img img-style">
        <Image loading="lazy" width={width} height={height} src={img} alt={name} />
      </Link>
      <div className="box-image_content">
        <Link
          href={href}
          className="title h3 fw-medium text-white link-underline-white text-decoration-thickness"
        >
          {name}
        </Link>
      </div>
    </div>
  );
}

export default function Collection() {
  const [canopies, flags, displays] = featuredCollections.map(getCollection);

  if (!canopies || !flags || !displays) {
    return null;
  }

  return (
    <div className="section-banner-collection">
      <div className="container">
        <div className="tf-grid-layout sm-col-2 gap-10">
          <CollectionCard
            href={canopies.href ?? "/shop-default"}
            img={canopies.img}
            name="Shop 10x10 Canopies"
            width={700}
            height={933}
          />
          <div className="d-flex flex-column gap-10">
            <CollectionCard
              href={flags.href ?? "/shop-default"}
              img={flags.img}
              name="Shop Flags"
              width={700}
              height={461}
              className="h-100"
            />
            <CollectionCard
              href={displays.href ?? "/shop-default"}
              img={displays.img}
              name="Shop Displays"
              width={700}
              height={461}
              className="h-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
