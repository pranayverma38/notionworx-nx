import Image from "next/image";
import Link from "next/link";
import TfSwiper from "@/components/ui/TfSwiper";
import { categoriesFashion2 } from "@/data/categories";

function Category() {
  return (
    <section className="flat-spacing">
      <div className="container-layout-right">
        <TfSwiper
          preview={4.3605}
          tablet={3.3}
          mobileSm={2.3}
          mobile={1.3}
          spaceLg={30}
          spaceMd={20}
          space={10}
          pagination={1}
          paginationSm={2}
          paginationMd={3}
          paginationLg={4}
          paginationDisabled={true}
        >
          {categoriesFashion2.map((item) => (
            <div
              key={item.img}
              className="category-v06 style-2 hover-img4 wow fadeInUp"
            >
              <Link href="/shop-default" className="cate-image img-style4">
                <Image
                  src={`${item.img}`}
                  alt={item.name}
                  width={400}
                  height={533}
                  loading="lazy"
                />
              </Link>
              <Link href="/shop-default" className="cate-content">
                <h6 className="cate_name">{item.name}</h6>
                {item.quantity != null && (
                  <p className="cate_quantity">{item.quantity}</p>
                )}
              </Link>
            </div>
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}

export default Category;
