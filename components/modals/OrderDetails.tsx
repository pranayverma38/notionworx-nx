import Image from "next/image";

type OrderDetailsProps = {
  registerModalElement?: (el: HTMLElement | null) => void;
};

export default function OrderDetails({
  registerModalElement,
}: OrderDetailsProps) {
  return (
    <div
      ref={registerModalElement}
      className="modal modalCentered fade modal-order_detail"
      id="orderDetail"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content tf-grid-layout md-col-2 gap-0">
          <div className="col-left">
            <div className="modal-heading text-center">
              <h5 className="title-pop">Order Details</h5>
              <span
                className="icon-X2 fs-24 cs-pointer link d-none d-md-block"
                data-bs-dismiss="modal"
              />
            </div>
            <div className="tf-grid-layout sm-col-2 md-col-1 lg-col-2 grid-info">
              <div className="box-info">
                <p className="info-title fw-medium cl-text-3">
                  Contact Information
                </p>
                <h6>Tony nguyen</h6>
                <h6>hi.avitex@gmail.com</h6>
              </div>
              <div className="box-info">
                <p className="info-title fw-medium cl-text-3">Payment Method</p>
                <h6>Cash Delivery</h6>
              </div>
              <div className="box-info">
                <p className="info-title fw-medium cl-text-3">
                  Shipping Address
                </p>
                <h6>
                  2163 Phillips Gap Rd, West Jefferson, North Carolina, US
                </h6>
              </div>
              <div className="box-info">
                <p className="info-title fw-medium cl-text-3">
                  Billing Address
                </p>
                <h6>
                  2163 Phillips Gap Rd, West Jefferson, North Carolina, US
                </h6>
              </div>
              <div className="box-info">
                <p className="info-title fw-medium cl-text-3">Company</p>
                <h6>Avitex Technology</h6>
              </div>
            </div>
          </div>
          <div className="col-right">
            <div className="modal-heading text-center">
              <h5 className="title-pop">Items</h5>
              <span
                className="icon-close-popup d-md-none"
                data-bs-dismiss="modal"
              >
                <i className="icon-X2" />
              </span>
            </div>
            <ul className="list-order-product">
              <li className="order-item fw-medium">
                <a href="#" className="img-prd">
                  <Image
                    loading="lazy"
                    width={100}
                    height={133}
                    src="/assets/images/product/product-3.jpg"
                    alt=""
                  />
                </a>
                <div className="infor-prd">
                  <a
                    href="#"
                    className="prd_name fw-medium lh-24 link link-underline"
                  >
                    V-neck cotton T-shirt
                  </a>
                  <div className="text-caption-01">
                    <span className="cl-text-2"> Color: </span>
                    Light Gray
                  </div>
                  <div className="text-caption-01">
                    <span className="cl-text-2"> Size: </span>
                    Small
                  </div>
                </div>
                <div className="quantity-price text-primary">$29.99</div>
              </li>
              <li className="order-item fw-medium">
                <a href="#" className="img-prd">
                  <Image
                    loading="lazy"
                    width={100}
                    height={133}
                    src="/assets/images/product/product-6.jpg"
                    alt=""
                  />
                </a>
                <div className="infor-prd">
                  <a
                    href="#"
                    className="prd_name fw-medium lh-24 link link-underline"
                  >
                    Oval shoulder bag
                  </a>
                  <div className="text-caption-01">
                    <span className="cl-text-2"> Color: </span>
                    Light Gray
                  </div>
                  <div className="text-caption-01">
                    <span className="cl-text-2"> Size: </span>
                    Small
                  </div>
                </div>
                <div className="quantity-price text-primary">$69.99</div>
              </li>
            </ul>
            <ul className="list-total">
              <li className="total-item lh-24 fw-medium">
                <span>Shipping</span>
                <span>Free</span>
              </li>
              <li className="total-item lh-24 fw-medium">
                <span>Discounts</span>
                <span>-$2.00</span>
              </li>
            </ul>
            <div className="last-total h5 fw-medium d-flex align-items-center justify-content-between">
              <span>Subtotal</span>
              <span>$186,99</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
