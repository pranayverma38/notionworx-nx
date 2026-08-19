import Link from "next/link";
import Image from "next/image";
function Category() {
  return (
    <>
      <div className="flat-spacing-5">
        <div className="container-full">
          <div className="cate-list wow fadeInUp">
            <Link href={`/shop-default`} className="wg-cate-text">
              <div className="cate-image">
                <Image
                  loading="lazy"
                  width={200}
                  height={200}
                  src="/assets/images/category/fashion-3/cate-1.jpg"
                  alt="Image"
                />
              </div>
              <div className="cate-text text-display letter-space-0 fw-medium">
                OUTDOOR SHOES<span className="h6">10</span>
              </div>
            </Link>
            <Link href={`/shop-default`} className="wg-cate-text">
              <div className="cate-image">
                <Image
                  loading="lazy"
                  width={200}
                  height={200}
                  src="/assets/images/category/fashion-3/cate-2.jpg"
                  alt="Image"
                />
              </div>
              <div className="cate-text text-display letter-space-0 fw-medium">
                GYM SHOES<span className="h6">14</span>
              </div>
            </Link>
            <Link href={`/shop-default`} className="wg-cate-text">
              <div className="cate-image">
                <Image
                  loading="lazy"
                  width={200}
                  height={200}
                  src="/assets/images/category/fashion-3/cate-3.jpg"
                  alt="Image"
                />
              </div>
              <div className="cate-text text-display letter-space-0 fw-medium">
                ROAD SHOES<span className="h6">18</span>
              </div>
            </Link>
            <Link href={`/shop-default`} className="wg-cate-text">
              <div className="cate-image">
                <Image
                  loading="lazy"
                  width={200}
                  height={200}
                  src="/assets/images/category/fashion-3/cate-4.jpg"
                  alt="Image"
                />
              </div>
              <div className="cate-text text-display letter-space-0 fw-medium">
                SPEED SHOES<span className="h6">25</span>
              </div>
            </Link>
            <Link href={`/shop-default`} className="wg-cate-text">
              <div className="cate-image">
                <Image
                  loading="lazy"
                  width={200}
                  height={200}
                  src="/assets/images/category/fashion-3/cate-5.jpg"
                  alt="Image"
                />
              </div>
              <div className="cate-text text-display letter-space-0 fw-medium">
                LIFESTYLE SHOES<span className="h6">24</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Category;
