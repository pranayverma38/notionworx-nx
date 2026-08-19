import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { categoriesJewelry } from "@/data/categories";

function Category() {
  return (
    <section>
      <div className="container-full">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">Curated Categories</h3>
          <p className="s-desc cl-text-2">
            Explore premium selections that redefine comfort and style.
          </p>
        </div>
        <TfSwiper
          preview={5}
          tablet={4}
          mobileSm={3}
          mobile={2}
          spaceLg={20}
          spaceMd={20}
          space={15}
          pagination={2}
          paginationSm={3}
          paginationMd={4}
          paginationLg={5}
          paginationClassName="sw-dot-default tf-sw-pagination"
        >
          {categoriesJewelry.map((item) => (
            <div key={item.img} className="category-v06 hover-img4">
              <Link href="/shop-default" className="cate-image img-style4">
                <Image
                  src={`${item.img}`}
                  alt={item.name}
                  width={338}
                  height={445}
                  loading="lazy"
                />
              </Link>
              <div className="cate-content">
                <Link
                  href="/shop-default"
                  className="cate_name h5 fw-medium link"
                >
                  {item.name}
                </Link>
                {item.quantity != null && (
                  <p className="cate_quantity cl-text-2">{item.quantity}</p>
                )}
              </div>
            </div>
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}

export default Category;
