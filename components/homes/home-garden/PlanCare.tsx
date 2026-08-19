import Image from "next/image";
import Link from "next/link";

const PLAN_CARE_ITEMS = [
  {
    img: "/assets/images/section/plan-item-1.jpg",
    itemImg: "/assets/images/item/garden-item-2.png",
    title: "Daily Plant Nutrient Care",
    description:
      "This liquid blend enriches soil, balances pH, boosts plant health, and blends easily with watering.",
    price: "12.00",
  },
  {
    img: "/assets/images/section/plan-item-2.jpg",
    itemImg: "/assets/images/item/garden-item-2.png",
    title: "Simple Pot Watering Aid",
    description:
      "A simple attachable tool that delivers hydration, making watering smoother and more consistent overall.",
    price: "18.00",
  },
];

function PlanCare() {
  return (
    <section>
      <div className="container">
        <div className="sect-heading type-2 text-center wow fadeInUp">
          <h3 className="s-title">Plant Care, Elevated for Home</h3>
          <p className="s-desc text-body-1 cl-text-2">
            Thoughtfully designed supplies that simplify nurturing your indoor
            greenery.
          </p>
        </div>
        <div className="row gap-x-40">
          {PLAN_CARE_ITEMS.map((item, index) => (
            <div key={item.img} className="col-lg-6">
              <div
                className={`plan-care-item hover-img4 ips-${index + 1}`}
              >
                <Link href="/product-detail/1" className="img-style4">
                  <Image
                    width={400}
                    height={400}
                    loading="lazy"
                    src={item.img}
                    alt="Plan image"
                  />
                </Link>
                <div className="content">
                  <div>
                    <h4 className="title mb-12 ">
                      <Link
                        href="/product-deals"
                        className="link text-line-clamp-2"
                      >
                        {item.title}
                      </Link>
                    </h4>
                    <p className="text-body-1 cl-text-2 text-line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                  <a
                    href="#shoppingCart"
                    data-bs-toggle="offcanvas"
                    className="tf-btn animate-btn small-2"
                  >
                    <span className="text-caption-01">
                      Buy now - ${item.price}
                    </span>
                  </a>
                </div>
                <div className="item">
                  <Image
                    width={153}
                    height={172}
                    src={`${item.itemImg}`}
                    alt="item"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PlanCare;
