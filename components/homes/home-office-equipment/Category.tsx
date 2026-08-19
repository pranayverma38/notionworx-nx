import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { categoriesOfficeEquipment } from "@/data/categories";

function Category() {
  return (
    <section className="flat-spacing-3 pb-0">
      <div className="container-full">
        <TfSwiper
          laptop={8}
          preview={6}
          tablet={4}
          mobileSm={3}
          mobile={2}
          spaceLg={20}
          spaceMd={15}
          space={10}
          pagination={2}
          paginationSm={3}
          paginationMd={4}
          paginationLg={8}
          paginationClassName="sw-line-default style-2 tf-sw-pagination"
        >
          {categoriesOfficeEquipment.map((item) => (
            <Link
              key={item.img}
              href="/shop-default"
              className="category-v02 style-3 hover-img wow fadeInUp"
            >
              <div className="cate-image img-style">
                <Image
                  src={`${item.img}`}
                  alt={item.name}
                  width={100}
                  height={100}
                  loading="lazy"
                />
              </div>
              <div className="cate-content text-center">
                <h6 className="cate_name link-underline-primary">{item.name}</h6>
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
