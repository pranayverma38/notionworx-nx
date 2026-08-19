import Image from "next/image";
import Link from "next/link";

import { AccountSection } from "@/components/account/AccountSection";
import TfSwiper from "@/components/ui/TfSwiper";
import { accountStats } from "@/data/account_stats";

/** Template SCSS uses `.acount-order_stats` (historical typo); keep class for styles. */
export default function AccountDashboard() {
  return (
    <AccountSection title="Dashboard">
      <div className="acount-order_stats">
        <TfSwiper
          preview={3}
          tablet={3}
          mobileSm={2}
          mobile={1}
          spaceLg={20}
          spaceMd={15}
          space={10}
          paginationLg={3}
          paginationMd={3}
          paginationSm={2}
          pagination={1}
          paginationClassName="sw-dot-default tf-sw-pagination"
        >
          {accountStats.map((stat, index) => (
            <div key={index} className="order-box">
              <div className="order_info">
                <p className="info__label cl-text-2">{stat.label}</p>
                <h5 className="info__count type-semibold">{stat.count}</h5>
              </div>
              <div className="order_icon">
                <i className={`icon ${stat.iconClass}`} />
              </div>
            </div>
          ))}
        </TfSwiper>
      </div>
      <div className="account-my_recent">
        <h6 className="title-case">Recent Orders</h6>
        <div className="overflow-auto">
          <table className="table-my_recent">
            <thead>
              <tr>
                <th>Order</th>
                <th>Products</th>
                <th>Pricing</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="tb-order-item">
                <td className="tb-order_code fw-medium">54312453</td>
                <td>
                  <div className="tb-order_product">
                    <Link href="/product-detail" className="img-prd">
                      <Image
                        loading="lazy"
                        width={48}
                        height={48}
                        src="/assets/images/product/square/product-1_2.jpg"
                        alt=""
                      />
                    </Link>
                    <div className="infor-prd">
                      <Link
                        href="/product-detail"
                        className="prd_name link fw-medium lh-24"
                      >
                        Faux-leather trousers
                      </Link>
                      <p className="prd_type cl-text-2 text-caption-01">
                        Women, Clothing
                      </p>
                    </div>
                  </div>
                </td>
                <td className="tb-order_price fw-medium">$45.00</td>
                <td>
                  <div className="tb-order_status text-label stt-pending">
                    Pending
                  </div>
                </td>
              </tr>
              <tr className="tb-order-item">
                <td className="tb-order_code fw-medium">54312452</td>
                <td>
                  <div className="tb-order_product">
                    <Link href="/product-detail" className="img-prd">
                      <Image
                        loading="lazy"
                        width={48}
                        height={48}
                        src="/assets/images/product/square/product-2.jpg"
                        alt=""
                      />
                    </Link>
                    <div className="infor-prd">
                      <Link
                        href="/product-detail"
                        className="prd_name link fw-medium lh-24"
                      >
                        Contrasting sweatshirt
                      </Link>
                      <p className="prd_type cl-text-2 text-caption-01">
                        Women, Clothing
                      </p>
                    </div>
                  </div>
                </td>
                <td className="tb-order_price fw-medium">$45.00</td>
                <td>
                  <div className="tb-order_status text-label stt-delivery">
                    Delivery
                  </div>
                </td>
              </tr>
              <tr className="tb-order-item">
                <td className="tb-order_code fw-medium">54312452</td>
                <td>
                  <div className="tb-order_product">
                    <Link href="/product-detail" className="img-prd">
                      <Image
                        loading="lazy"
                        width={48}
                        height={48}
                        src="/assets/images/product/square/product-4_2.jpg"
                        alt=""
                      />
                    </Link>
                    <div className="infor-prd">
                      <Link
                        href="/product-detail"
                        className="prd_name link fw-medium lh-24"
                      >
                        V-neck knitted top
                      </Link>
                      <p className="prd_type cl-text-2 text-caption-01">
                        Women, Clothing
                      </p>
                    </div>
                  </div>
                </td>
                <td className="tb-order_price fw-medium">$45.00</td>
                <td>
                  <div className="tb-order_status text-label stt-completed">
                    Completed
                  </div>
                </td>
              </tr>
              <tr className="tb-order-item">
                <td className="tb-order_code fw-medium">54312452</td>
                <td>
                  <div className="tb-order_product">
                    <Link href="/product-detail" className="img-prd">
                      <Image
                        loading="lazy"
                        width={48}
                        height={48}
                        src="/assets/images/product/square/product-5_3.jpg"
                        alt=""
                      />
                    </Link>
                    <div className="infor-prd">
                      <Link
                        href="/product-detail"
                        className="prd_name link fw-medium lh-24"
                      >
                        Contrasting sweatshirt
                      </Link>
                      <p className="prd_type cl-text-2 text-caption-01">
                        Women, Clothing
                      </p>
                    </div>
                  </div>
                </td>
                <td className="tb-order_price fw-medium">$45.00</td>
                <td>
                  <div className="tb-order_status text-label stt-pending">
                    Pending
                  </div>
                </td>
              </tr>
              <tr className="tb-order-item">
                <td className="tb-order_code fw-medium">54312456</td>
                <td>
                  <div className="tb-order_product">
                    <Link href="/product-detail" className="img-prd">
                      <Image
                        loading="lazy"
                        width={48}
                        height={48}
                        src="/assets/images/product/square/product-7_2.jpg"
                        alt=""
                      />
                    </Link>
                    <div className="infor-prd">
                      <Link
                        href="/product-detail"
                        className="prd_name link fw-medium lh-24"
                      >
                        Faux-leather trousers
                      </Link>
                      <p className="prd_type cl-text-2 text-caption-01">
                        Women, Clothing
                      </p>
                    </div>
                  </div>
                </td>
                <td className="tb-order_price fw-medium">$45.00</td>
                <td>
                  <div className="tb-order_status text-label stt-delivery">
                    Delivery
                  </div>
                </td>
              </tr>
              <tr className="tb-order-item">
                <td className="tb-order_code fw-medium">54312457</td>
                <td>
                  <div className="tb-order_product">
                    <Link href="/product-detail" className="img-prd">
                      <Image
                        loading="lazy"
                        width={48}
                        height={48}
                        src="/assets/images/product/square/product-9_2.jpg"
                        alt=""
                      />
                    </Link>
                    <div className="infor-prd">
                      <Link
                        href="/product-detail"
                        className="prd_name link fw-medium lh-24"
                      >
                        V-neck knitted top
                      </Link>
                      <p className="prd_type cl-text-2 text-caption-01">
                        Women, Clothing
                      </p>
                    </div>
                  </div>
                </td>
                <td className="tb-order_price fw-medium">$45.00</td>
                <td>
                  <div className="tb-order_status text-label stt-canceled">
                    Canceled
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AccountSection>
  );
}
