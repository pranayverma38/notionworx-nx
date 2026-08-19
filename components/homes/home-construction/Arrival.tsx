import Image from "next/image";
import Link from "next/link";
import { arrivalConstruction } from "@/data/arrivalConstruction";
import AddToCartButton from "@/components/common/AddToCartButton";

function formatPrice(value: number): string {
  return "$" + value.toFixed(2).replace(".", ",");
}

function Arrival() {
  const { heading, title, description, product, banners } =
    arrivalConstruction;

  return (
    <section className="section-thumbs-arrival style-2 flat-spacing">
      <div className="container-full">
        <div className="tf-grid-layout xl-col-3 md-col-2 gap-15">
          <div className="content order-1 order-md-0">
            <div className="heading">
              <p className="h6">{heading}</p>
              <h1>{title}</h1>
              <p className="text-body-1 cl-text-2">{description}</p>
            </div>
            <div className="thumbs-prd">
              <div className="prd-image">
                <Image
                  src={`${product.img}`}
                  alt={product.name}
                  width={100}
                  height={100}
                  loading="lazy"
                />
              </div>
              <div className="prd-info">
                <Link
                  href={`/product-detail/${product.id}`}
                  className="info_name text-body-1 link"
                >
                  {product.name}
                </Link>
                <div className="info_price">
                  <div className="price-wrap">
                    <span className="price-new font-outfit">
                      {formatPrice(product.price)}
                    </span>
                    {product.priceOld != null && (
                      <span className="price-old text-caption-01 cl-text-2 font-outfit">
                        {formatPrice(product.priceOld)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="prd-action">
                <AddToCartButton product={product} variant="tooltip" />
              </div>
            </div>
          </div>
          {banners.map((banner, i) => (
            <div
              key={banner.img}
              className={`hover-img4 ${i === 1 ? "d-none d-xl-block" : ""}`}
            >
              <div className="img-style4 w-100 h-100">
                <Image
                  className="img-cove"
                  src={`${banner.img}`}
                  alt=""
                  width={banner.width}
                  height={banner.height}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Arrival;
