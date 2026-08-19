import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { categoriesPod } from "@/data/categories";

function Category() {
  return (
    <div className="mt-10 px-10">
      <TfSwiper
        laptop={5}
        preview={4}
        tablet={3}
        mobileSm={2}
        mobile={1}
        space={10}
        pagination={1}
        paginationSm={2}
        paginationMd={3}
        paginationLg={5}
        paginationClassName="sw-dot-default tf-sw-pagination"
      >
        {categoriesPod.map((item) => (
          <div key={item.img ?? item.name} className="category-v03 hover-img4 wow fadeInUp">
            <Link href="/shop-default" className="cate-image img-style4">
              <Image
                src={`${item.img}`}
                alt={item.name}
                width={372}
                height={490}
                loading="lazy"
              />
            </Link>
            <div className="cate-content">
              <Link href="/shop-default" className="cate_name h6 fw-medium">
                {item.name}
                <i className="icon icon-ArrowUpRight1" aria-hidden />
              </Link>
            </div>
          </div>
        ))}
      </TfSwiper>
    </div>
  );
}

export default Category;
