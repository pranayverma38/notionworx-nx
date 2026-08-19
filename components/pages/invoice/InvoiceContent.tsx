import Link from "next/link";

function InvoiceContent() {
  return (
    <>
      <div className="s-invoice">
        <div className="container">
          <h1 className="heading fw-semibold text-center">Amerce. Invoice</h1>
          <div className="wg-invoice">
            <div className="invoice-head">
              <p className="h4 invoice_number">Number #0079347644</p>
              <a href="#" className="invoice_download-btn tf-btn animate-btn">
                Download
                <i className="icon icon-download" />
              </a>
            </div>
            <div className="invoice-info">
              <div className="invoice-info_item invoice-info_date">
                <p className="h6 invoice_label fw-semibold">Invoice date:</p>
                <p className="invoice_value ">December 30, 2025</p>
              </div>
              <div className="invoice-info_item invoice-info_date">
                <p className="h6 invoice_label fw-semibold">Due date:</p>
                <p className="invoice_value ">December 30, 2025</p>
              </div>
              <div className="invoice-info_item">
                <p className="h6 invoice_label fw-semibold">Supplier:</p>
                <p className="invoice_value">
                  <span className="fw-medium text-black">Themesflat LLC</span>
                  8500 Lorem Street Chicago, IL 55030 Dolor sit amet
                </p>
              </div>
              <div className="invoice-info_item">
                <p className="h6 invoice_label fw-semibold">Invoice date:</p>
                <p className="invoice_value">
                  <span className="fw-medium text-black">Brooklyn Simmons</span>
                  2972 Westheimer Rd. Santa Ana, Illinois 85486
                </p>
              </div>
            </div>
            <div className="overflow-auto">
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Price</th>
                    <th>VAT (20%)</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-body-1 invoice__desc">Standard Plan</td>
                    <td className="text-body-1 invoice__price">$20.00</td>
                    <td className="text-body-1 invoice__vat">$10.00</td>
                    <td className="text-body-1 invoice__total">$60.00</td>
                  </tr>
                  <tr>
                    <td className="text-body-1 invoice__desc">Extra Plan</td>
                    <td className="text-body-1 invoice__price">$20.00</td>
                    <td className="text-body-1 invoice__vat">$10.00</td>
                    <td className="text-body-1 invoice__total">$60.00</td>
                  </tr>
                  <tr>
                    <td className="text-body-1 invoice__desc fw-semibold">
                      Total Due
                    </td>
                    <td />
                    <td />
                    <td className="text-body-1 invoice__amount fw-semibold text-primary">
                      $60.00
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ul className="invoice-social">
              <li>
                <Link href={`/`} className="invoice_link link text-body-1">
                  www.amerce.com
                </Link>
              </li>
              <li>
                <a
                  href="tel:+88001234567"
                  className="invoice_link link text-body-1"
                >
                  +8(800) 123 4567
                </a>
              </li>
              <li>
                <a
                  href="mailto:themesflat@support.com"
                  className="invoice_link link text-body-1"
                >
                  themesflat@support.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default InvoiceContent;
