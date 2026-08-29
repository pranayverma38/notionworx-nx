import type { ProductCardItem } from "@/types/productCard";
import { ProductLongFormContent } from "./ProductLongFormContent";

type ProductHowToOrderProps = {
  product?: ProductCardItem;
  titleTag?: "h5" | "div";
  wrapperClassName?: string;
};

type ParsedHowToOrderStep = {
  title: string;
  details: string[];
};

function decodeHtmlText(text: string): string {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function htmlToPlainText(html?: string): string {
  if (!html) {
    return "";
  }

  return decodeHtmlText(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<li\b[^>]*>/gi, "- ")
      .replace(/<\/h[1-6]>/gi, "\n\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\n\s+\n/g, "\n\n")
      .replace(/[ \t]+/g, " "),
  ).trim();
}

function parseHowToOrderContent(product?: ProductCardItem): {
  heading: string | null;
  introLines: string[];
  steps: ParsedHowToOrderStep[];
} {
  const rawText =
    product?.howToOrderText?.trim() || htmlToPlainText(product?.howToOrderHtml);
  const blocks = rawText
    .split(/\n\s*\n+/)
    .map((block) => block.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);

  const introLines: string[] = [];
  const steps: ParsedHowToOrderStep[] = [];
  let heading: string | null = null;
  let currentStep: ParsedHowToOrderStep | null = null;

  for (const block of blocks) {
    if (/^3 Easy Steps$/i.test(block)) {
      heading = block;
      continue;
    }

    if (/^Step\s+\d+\s*:/i.test(block)) {
      if (currentStep) {
        steps.push(currentStep);
      }

      currentStep = {
        title: block,
        details: [],
      };
      continue;
    }

    if (currentStep) {
      currentStep.details.push(block.replace(/^-+\s*/, ""));
      continue;
    }

    introLines.push(block.replace(/^-+\s*/, ""));
  }

  if (currentStep) {
    steps.push(currentStep);
  }

  return { heading, introLines, steps };
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
  const { heading, introLines, steps } = parseHowToOrderContent(product);
  const hasStructuredSteps = steps.length > 0;

  return (
    <div className={`${wrapperClassName} product-detail-single-layout`}>
      <div className="box-desc product-detail-description-card product-detail-description-main">
        {title}
        {hasStructuredSteps ? (
          <div className="how-to-order-structured">
            {introLines.length ? (
              <div className="how-to-order-meta">
                {introLines.map((line) => (
                  <div key={line} className="how-to-order-meta-item">
                    {line}
                  </div>
                ))}
              </div>
            ) : null}

            {heading ? <h3 className="how-to-order-heading">{heading}</h3> : null}

            <div className="how-to-order-step-list">
              {steps.map((step, index) => (
                <article key={step.title} className="how-to-order-step-card">
                  <div className="how-to-order-step-index">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="how-to-order-step-content">
                    <h4 className="how-to-order-step-title">{step.title}</h4>
                    <div className="how-to-order-step-details">
                      {step.details.map((detail) => (
                        <p key={detail}>{detail}</p>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="desc_info">
            <ProductLongFormContent
              html={product?.howToOrderHtml}
              text={product?.howToOrderText}
              fallbackText="Ordering instructions will be added once the crawl content is available."
            />
          </div>
        )}
      </div>
    </div>
  );
}
