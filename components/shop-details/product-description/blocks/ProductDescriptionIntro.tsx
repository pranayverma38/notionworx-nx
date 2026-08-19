type IntroProps = {
  gridClassName?: string;
  /** `h5` for tab / accordion-v2 layouts; `div` with `.h6` for sidebar accordion. */
  titleTag?: "h5" | "div";
};

export function ProductDescriptionIntro({
  gridClassName = "tab-content_desc tf-grid-layout md-col-2",
  titleTag = "h5",
}: IntroProps) {
  const primaryTitle =
    titleTag === "h5" ? (
      <h5 className="desc_title">Stretch Strap Top</h5>
    ) : (
      <div className="h6 desc_title">Stretch Strap Top</div>
    );

  const secondaryTitle =
    titleTag === "h5" ? (
      <h5 className="desc_title">Composition, Origin And Care Guidelines</h5>
    ) : (
      <div className="h6 desc_title">
        Composition, Origin And Care Guidelines
      </div>
    );

  return (
    <div className={gridClassName}>
      <div className="box-desc">
        {primaryTitle}
        <div className="desc_info">
          <p className="cl-text-2">
            Nodding to retro styles, this Hyperbola T-shirt is defined by its
            off-the-shoulder design. It&apos;s spun from a green stretch cotton
            jersey and adorned with an embroidered.
          </p>
          <p className="cl-text-2">
            Thick knitted fabric. Short design. Straight design. Rounded neck.
            Sleeveless. Straps. Unclosed. Cable knit finish. Co-ord.
          </p>
        </div>
      </div>
      <div className="box-desc">
        {secondaryTitle}
        <ul className="list">
          <li className="cl-text-2">
            - Composition: 55% polyester, 30% acrylic, 13% polyamide, 2%
            elastane
          </li>
          <li className="cl-text-2">- Designed in Barcelona</li>
          <li className="cl-text-2">- Origin</li>
          <li className="cl-text-2">- Manufacture: USA</li>
        </ul>
      </div>
    </div>
  );
}
