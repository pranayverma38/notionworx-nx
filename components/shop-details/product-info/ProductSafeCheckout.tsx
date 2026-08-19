import Image from "next/image";

export function ProductSafeCheckout() {
  return (
    <div className="tf-product-trust-seal">
      <p className="h6 text-seal">Guranteed Safe Checkout:</p>
      <ul className="list-card">
        <li className="card-item">
          <Image
            width={50}
            height={32}
            src="/assets/images/payment/visa.svg"
            alt="card"
          />
        </li>
        <li className="card-item">
          <Image
            width={50}
            height={32}
            src="/assets/images/payment/master-card.svg"
            alt="card"
          />
        </li>
        <li className="card-item">
          <Image
            width={50}
            height={32}
            src="/assets/images/payment/amex.svg"
            alt="card"
          />
        </li>
        <li className="card-item">
          <Image
            width={50}
            height={32}
            src="/assets/images/payment/paypal.svg"
            alt="card"
          />
        </li>
        <li className="card-item">
          <Image
            width={50}
            height={32}
            src="/assets/images/payment/water.svg"
            alt="card"
          />
        </li>
        <li className="card-item">
          <Image
            width={50}
            height={32}
            src="/assets/images/payment/discover.svg"
            alt="card"
          />
        </li>
      </ul>
    </div>
  );
}
