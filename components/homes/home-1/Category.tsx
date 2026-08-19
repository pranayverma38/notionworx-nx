import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { categories } from "@/data/categories";

function Category() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">Shop By Categories</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Top styles everyone&apos;s talking about.
          </p>
        </div>
        <TfSwiper
          preview={6}
          tablet={4}
          mobileSm={3}
          mobile={2}
          spaceLg={30}
          spaceMd={15}
          space={10}
          pagination={2}
          paginationSm={3}
          paginationMd={4}
          paginationLg={6}
        >
          {categories.map((item) => (
            <div key={item.name} className="wow fadeInUp">
              <Link href="/shop-default" className="category-v01 hover-img">
                <div className="cate-image img-style">
                  { }
                  <Image
                    loading="lazy"
                    width={210}
                    height={210}
                    src={`${item.img}`}
                    alt={item.name}
                  />
                </div>
                <p className="cate-name h5 text-center link link-underline">
                  {item.name}
                </p>
              </Link>
            </div>
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}

export default Category;
