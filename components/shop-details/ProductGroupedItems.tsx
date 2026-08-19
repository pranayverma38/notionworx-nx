"use client";
import Image from "next/image";

export interface GroupedItem {
  id: number;
  name: string;
  price: number;
  priceOld?: number;
  img: string;
  quantity: number;
  variant: string;
}

interface ProductGroupedItemsProps {
  items: GroupedItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onUpdateVariant: (id: number, variant: string) => void;
}

export default function ProductGroupedItems({
  items,
  onUpdateQuantity,
  onUpdateVariant,
}: ProductGroupedItemsProps) {
  return (
    <div className="tf-product-more-option">
      {items.map((item) => (
        <div key={item.id} className="more-option-item">
          <a href="#" className="more_image">
            <Image
              loading="lazy"
              width={100}
              height={133}
              src={item.img}
              alt={item.name}
            />
          </a>
          <div className="more_info">
            <a href="#" className="info__name fw-medium link">
              {item.name}
            </a>
            <div className="info__price">
              <p className="text-primary fw-semibold">${item.price}</p>
              {item.priceOld && (
                <p className="cl-text-3 text-decoration-line-through text-caption-01">
                  ${item.priceOld}
                </p>
              )}
              {item.priceOld && (
                <span className="badge-sale text-white fw-semibold text-caption-02">
                  -
                  {Math.round(
                    ((item.priceOld - item.price) / item.priceOld) * 100,
                  )}
                  %
                </span>
              )}
            </div>
            <div className="info__select-quantity">
              <div className="select-wrap">
                <select
                  className="select-3"
                  value={item.variant}
                  onChange={(e) => onUpdateVariant(item.id, e.target.value)}
                >
                  <option value="Green, XS">Green, XS</option>
                  <option value="Green, M">Green, M</option>
                  <option value="Green, L">Green, L</option>
                </select>
                <i className="icon icon-CaretDown" />
              </div>
              <div className="wg-quantity">
                <button
                  type="button"
                  className="btn-quantity minus-btn"
                  onClick={() => onUpdateQuantity(item.id, -1)}
                >
                  <i className="icon icon-minus" />
                </button>
                <input
                  className="quantity-product"
                  type="text"
                  name="number"
                  value={item.quantity}
                  readOnly
                />
                <button
                  type="button"
                  className="btn-quantity plus-btn"
                  onClick={() => onUpdateQuantity(item.id, 1)}
                >
                  <i className="icon icon-plus" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
