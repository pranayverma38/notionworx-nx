import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { categoriesFurniture } from "@/data/categories";

function Category() {
  return (
    <div className="flat-spacing-3 pt-0 mt-10">
      <div className="container-full">
        <TfSwiper
          laptop={7}
          preview={5}
          tablet={4}
          mobileSm={3}
          mobile={2}
          spaceLg={20}
          spaceMd={15}
          space={10}
          pagination={2}
          paginationSm={3}
          paginationMd={4}
          paginationLg={7}
          paginationClassName="sw-dot-default tf-sw-pagination"
        >
          {categoriesFurniture.map((item) => (
            <Link
              key={item.icon ?? item.img ?? item.name}
              href="/shop-default"
              className={`category-v05 wow fadeInUp ${item.icon != null ? "bg-primary" : "bg-main"}`}
            >
              {item.icon != null ? (
                <div className="cate-icon text-white">
                  <i className={`icon ${item.icon}`} aria-hidden />
                </div>
              ) : item.img != null ? (
                <div className="cate-image">
                  <Image
                    src={`${item.img}`}
                    alt={item.name}
                    width={60}
                    height={60}
                    loading="lazy"
                  />
                </div>
              ) : null}
              <div className="cate-content">
                <h6 className={`cate_name ${item.icon != null ? "text-white" : "link"}`}>
                  {item.name}
                </h6>
                {item.quantity != null && (
                  <p className={`cate_quantity ${item.icon != null ? "text-white" : "cl-text-2"}`}>
                    {item.quantity}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </TfSwiper>
      </div>
    </div>
  );
}

export default Category;
