import type { ProductCardItem } from "@/types/productCard";
import { ProductLongFormContent } from "./ProductLongFormContent";

type ProductHowToOrderProps = {
  product?: ProductCardItem;
  titleTag?: "h5" | "div";
  wrapperClassName?: string;
};

type ParsedHowToOrderStep = {
  index: string;
  titleHtml: string;
  detailHtmlParts: string[];
};

type ParsedHowToOrderContent = {
  sku?: string;
  heading?: string;
  steps: ParsedHowToOrderStep[];
};

function stripHtml(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseStructuredHowToOrder(html?: string): ParsedHowToOrderContent | null {
  const normalizedHtml = html?.trim();

  if (!normalizedHtml) {
    return null;
  }

  const skuMatch = normalizedHtml.match(
    /<li\b[^>]*>\s*SKU\s*<br\s*\/?>\s*([\s\S]*?)<\/li>/i,
  );
  const headingMatch = normalizedHtml.match(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/i);
  const paragraphMatches = [...normalizedHtml.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)];

  const steps = paragraphMatches
    .map((match) => match[1]?.trim())
    .filter(Boolean)
    .map((paragraphHtml) => {
      const parts = paragraphHtml.split(/<br\s*\/?>\s*<br\s*\/?>/i).map((part) => part.trim());
      const titleHtml = parts[0] || "";
      const titleText = stripHtml(titleHtml);
      const stepMatch = titleText.match(/^Step\s+(\d+)\s*:/i);

      if (!stepMatch) {
        return null;
      }

      return {
        index: stepMatch[1].padStart(2, "0"),
        titleHtml,
        detailHtmlParts: parts.slice(1).filter(Boolean),
      } satisfies ParsedHowToOrderStep;
    })
    .filter(Boolean) as ParsedHowToOrderStep[];

  if (!steps.length) {
    return null;
  }

  return {
    sku: skuMatch ? stripHtml(skuMatch[1]) : undefined,
    heading: headingMatch ? stripHtml(headingMatch[1]) : undefined,
    steps,
  };
}

export function ProductHowToOrder({
  product,
  titleTag = "h5",
  wrapperClassName = "tab-content_desc",
}: ProductHowToOrderProps) {
  const title =
    titleTag === "h5" ? (
      <h5 className="desc_title">How to Order</h5>
    ) : (
      <div className="h6 desc_title">How to Order</div>
    );
  const structuredContent = parseStructuredHowToOrder(product?.howToOrderHtml);

  return (
    <div className={`${wrapperClassName} product-detail-single-layout`}>
      <div className="box-desc product-detail-description-card product-detail-description-main">
        {title}
        <div className="desc_info">
          {structuredContent ? (
            <div className="how-to-order-structured">
              {structuredContent.sku ? (
                <div className="how-to-order-meta">
                  <span className="how-to-order-meta-item">
                    SKU {structuredContent.sku}
                  </span>
                </div>
              ) : null}
              {structuredContent.heading ? (
                <h3 className="how-to-order-heading">{structuredContent.heading}</h3>
              ) : null}
              <div className="how-to-order-step-list">
                {structuredContent.steps.map((step) => (
                  <article
                    key={`${step.index}-${stripHtml(step.titleHtml)}`}
                    className="how-to-order-step-card"
                  >
                    <div className="how-to-order-step-index">{step.index}</div>
                    <div className="how-to-order-step-content">
                      <h4
                        className="how-to-order-step-title"
                        dangerouslySetInnerHTML={{ __html: step.titleHtml }}
                      />
                      <div className="how-to-order-step-details">
                        {step.detailHtmlParts.map((detailHtml, index) => (
                          <p
                            key={`${step.index}-${index}`}
                            dangerouslySetInnerHTML={{ __html: detailHtml }}
                          />
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <ProductLongFormContent
              html={product?.howToOrderHtml}
              text={product?.howToOrderText}
              fallbackText="Ordering instructions will be added once the crawl content is available."
            />
          )}
        </div>
      </div>
    </div>
  );
}
