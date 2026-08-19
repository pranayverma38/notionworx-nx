 "use client";

import Link from "next/link";
import Image from "next/image";

import { useContextElement, type Product } from "@/context/Context";

export default function Compare({
  registerOffcanvasElement,
}: {
  registerOffcanvasElement?: (el: HTMLElement | null) => void;
}) {
  const { compareItem, removeFromCompareItem, setCompareItem } =
    useContextElement();

  return (
    <div
      ref={registerOffcanvasElement}
      className="offcanvas offcanvas-bottom canvas-compare"
      id="compare"
    >
      <div className="canvas-wrapper">
        <div className="canvas-body">
          <div className="container">
            <div
              className={`tf-compare-list main-list-clear ${compareItem.length === 0 ? "wrap-empty_text" : ""}`}
            >
              <div className="tf-compare-head">
                <h4 className="title letter-space-0">Compare products</h4>
              </div>
              <div
                className={`tf-compare-offcanvas ${compareItem.length === 0 ? "list-empty" : ""}`}
              >
                {compareItem.length === 0 ? (
                  <p className="box-text_empty cl-text-2">
                    Your Compare is curently empty
                  </p>
                ) : (
                  compareItem.map((item) => (
                    <CompareOffcanvasItem
                      key={item.id}
                      item={item}
                      onRemove={() => removeFromCompareItem(item.id)}
                    />
                  ))
                )}
              </div>
              <div className="tf-compare-buttons justify-content-center">
                <Link href={`/compare`} className="tf-btn animate-btn">
                  Compare{" "}
                </Link>
                <button
                  type="button"
                  onClick={() => setCompareItem([])}
                  className="tf-btn btn-white btn-stroke clear-list-empty tf-compare-button-clear-all"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompareOffcanvasItem({
  item,
  onRemove,
}: {
  item: Product;
  onRemove: () => void;
}) {
  const imgSrc =
    item.img ?? item.images?.[0]?.src ?? "/assets/images/product/product-1.jpg";

  return (
    <div className="tf-compare-item file-delete">
      <Link href={`/product-detail/${item.id}`}>
        <button
          type="button"
          className="icon remove border-0 p-0"
          aria-label="Remove from compare"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
        >
          <i className="icon-X2" />
        </button>
        <Image className="radius-3" width={660} height={880} src={imgSrc} alt="" />
      </Link>
    </div>
  );
}
