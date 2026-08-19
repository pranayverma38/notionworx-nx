type TitleTag = "h5" | "div";

type Props = {
  gridClassName?: string;
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

export function ProductShippingReturns({
  gridClassName = "tab-content_desc desc-2 tf-grid-layout sm-col-2 xl-col-4",
  titleTag = "h5",
}: Props) {
  return (
    <div className={gridClassName}>
      <div className="box-desc">
        <DescTitle tag={titleTag}>We&apos;ve got your back</DescTitle>
        <div className="desc_info">
          <p className="cl-text-2">
            Free returns within 14 days (excludes final sale and made-to-order
            items, face masks and certain products containing hazardous or
            flammable materials, such as fragrances and aerosols)
          </p>
        </div>
      </div>
      <div className="box-desc">
        <DescTitle tag={titleTag}>Import duties information</DescTitle>
        <div className="desc_info">
          <p className="cl-text-2">
            Delivery duties are included in the item price when shipping to all
            EU countries (excluding the Canary Islands), plus The United
            Kingdom, USA, Canada, China Mainland, Australia, New Zealand.
          </p>
        </div>
      </div>
      <div className="box-desc">
        <DescTitle tag={titleTag}>Estimated delivery</DescTitle>
        <ul className="list">
          <li className="cl-text-2">- Express:&nbsp;May 10 - May 17</li>
          <li className="cl-text-2">- Sending from USA</li>
        </ul>
      </div>
      <div className="box-desc">
        <DescTitle tag={titleTag}>More information?</DescTitle>
        <ul className="list">
          <li className="cl-text-2">- Orders &amp; delivery</li>
          <li className="cl-text-2">- Duties &amp; taxes</li>
        </ul>
      </div>
    </div>
  );
}
