type ProductLongFormContentProps = {
  html?: string;
  text?: string;
  fallbackText: string;
  className?: string;
};

function normalizeLeadingDocumentLinks(html?: string) {
  const normalized = html?.trim();

  if (!normalized) {
    return undefined;
  }

  const upgradeLeadingBlock = (match: string, innerHtml: string) => {
    const plainText = innerHtml
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (
      /^(Specsheet|Download Template)( Warning Label)?( Fire Certificate)?$/i.test(
        plainText,
      )
    ) {
      return `<p class="rich-content__documents">${innerHtml}</p>`;
    }

    return match;
  };

  return normalized
    .replace(
      /^<p\b[^>]*>([\s\S]*?)<\/p>/i,
      (match, innerHtml) => upgradeLeadingBlock(match, innerHtml),
    )
    .replace(
      /^<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/i,
      (match, innerHtml) => upgradeLeadingBlock(match, innerHtml),
    );
}

export function ProductLongFormContent({
  html,
  text,
  fallbackText,
  className = "cl-text-2",
}: ProductLongFormContentProps) {
  const normalizedHtml = normalizeLeadingDocumentLinks(html);
  const normalizedText = text?.trim();
  const contentClassName = [className, "rich-content"]
    .filter(Boolean)
    .join(" ");

  if (normalizedHtml) {
    return (
      <div
        className={contentClassName}
        dangerouslySetInnerHTML={{ __html: normalizedHtml }}
      />
    );
  }

  return (
    <div className={contentClassName} style={{ whiteSpace: "pre-line" }}>
      {normalizedText || fallbackText}
    </div>
  );
}
