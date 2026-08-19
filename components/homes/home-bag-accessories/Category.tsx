import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { categoriesBagAccessories } from "@/data/categories";

function Category() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">Shop By Categories</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Discover bags and accessories crafted for everyday style.
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
          {categoriesBagAccessories.map((item) => (
            <Link
              key={item.img}
              href="/shop-default"
              className="category-v08 hover-img wow fadeInUp"
            >
              <div className="cate-image img-style">
                <Image
                  src={`${item.img}`}
                  alt={item.name}
                  width={210}
                  height={210}
                  loading="lazy"
                />
              </div>
              <div className="cate-content text-center">
                <p className="cate_name h5">
                  {item.name}
                  <i className="icon icon-ArrowUpRight" aria-hidden />
                </p>
                {item.quantity != null && (
                  <p className="cate_quantity cl-text-2">{item.quantity}</p>
                )}
              </div>
            </Link>
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}

export default Category;
