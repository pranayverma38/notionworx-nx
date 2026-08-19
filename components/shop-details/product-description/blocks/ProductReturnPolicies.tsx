type TitleTag = "h5" | "div";

type Props = {
  wrapperClassName?: string;
  titleTag?: TitleTag;
};

function DescTitle({
  tag,
  children,
}: {
  tag: TitleTag;
  children: React.ReactNode;
}) {
  if (tag === "h5") {
    return <h5 className="desc_title">{children}</h5>;
  }
  return <div className="h6 desc_title">{children}</div>;
}

export function ProductReturnPolicies({
  wrapperClassName = "tab-content_desc desc-3 d-grid",
  titleTag = "h5",
}: Props) {
  return (
    <div className={wrapperClassName}>
      <div className="box-desc">
        <DescTitle tag={titleTag}>Return Policies</DescTitle>
        <p className="desc_info cl-text-2">
          At Amerce, we stand behind the quality of our products. If you&apos;re
          not completely satisfied with your purchase, we offer hassle-free
          returns within 30 days of delivery.
        </p>
      </div>
      <div className="box-desc">
        <DescTitle tag={titleTag}>Return Policies</DescTitle>
        <ul className="list">
          <li className="cl-text-2">
            - Exchange your item for a different size, color, or style, or
            receive a full refund.
          </li>
          <li className="cl-text-2">
            - All returned items must be unworn, in their original packaging,
            and with tags attached.
          </li>
        </ul>
      </div>
      <div className="box-desc">
        <DescTitle tag={titleTag}>Return Policies</DescTitle>
        <ul className="list">
          <li className="cl-text-2">
            - Initiate your return online or contact our customer service team
            for assistance.
          </li>
          <li className="cl-text-2">
            - Pack your item securely and include the original packing slip.
          </li>
          <li className="cl-text-2">
            - Ship your return back to us using our prepaid shipping label.
          </li>
          <li className="cl-text-2">
            - Once received, your refund will be processed promptly.
          </li>
        </ul>
      </div>
    </div>
  );
}
