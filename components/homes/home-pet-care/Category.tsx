import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { categoriesPetCare } from "@/data/categories";

function Category() {
  return (
    <div className="flat-spacing-3">
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
          {categoriesPetCare.map((item) => (
            <Link
              key={item.img}
              href="/shop-default"
              className={`category-v05 wow fadeInUp ${item.variant ?? ""}`}
            >
              {item.img != null && (
                <div className="cate-image">
                  <Image
                    src={`${item.img}`}
                    alt={item.name}
                    width={60}
                    height={60}
                    loading="lazy"
                  />
                </div>
              )}
              <div className="cate-content">
                <h6 className="cate_name link">{item.name}</h6>
                {item.quantity != null && (
                  <p className="cate_quantity cl-text-2">{item.quantity}</p>
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
