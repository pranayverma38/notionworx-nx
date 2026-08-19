"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import { AccountSection } from "@/components/account/AccountSection";

const ORDER_TABS = [
  { id: "all-order", label: "All Order" },
  { id: "pending", label: "Pending" },
  { id: "delivery", label: "Delivery" },
  { id: "completed", label: "Completed" },
  { id: "canceled", label: "Canceled" },
] as const;

const DEFAULT_TAB_ID = "all-order";

type OrderStatus = "pending" | "delivery" | "completed" | "canceled";

type OrderLineItem = {
  img: string;
  name: string;
  variant: string;
  qty: number;
  price: string;
};

type OrderRow = {
  orderNumber: string;
  status: OrderStatus;
  statusLabel: string;
  statusClass: string;
  items: OrderLineItem[];
  showCancelOrder: boolean;
};

const ORDERS: OrderRow[] = [
  {
    orderNumber: "S184989823",
    status: "delivery",
    statusLabel: "Delivery",
    statusClass: "stt-delivery",
    showCancelOrder: true,
    items: [
      {
        img: "/assets/images/product/square/product-1.jpg",
        name: "Contrasting sheepskin sweatshirt",
        variant: "XL/Blue",
        qty: 1,
        price: "$60.00",
      },
      {
        img: "/assets/images/product/square/product-3.jpg",
        name: "Contrasting sheepskin sweatshirt",
        variant: "XL/Blue",
        qty: 1,
        price: "$60.00",
      },
    ],
  },
  {
    orderNumber: "S184989823",
    status: "pending",
    statusLabel: "Pending",
    statusClass: "stt-pending",
    showCancelOrder: true,
    items: [
      {
        img: "/assets/images/product/square/product-4.jpg",
        name: "Contrasting sheepskin sweatshirt",
        variant: "XL/Blue",
        qty: 1,
        price: "$60.00",
      },
    ],
  },
  {
    orderNumber: "S184989823",
    status: "completed",
    statusLabel: "Completed",
    statusClass: "stt-completed",
    showCancelOrder: false,
    items: [
      {
        img: "/assets/images/product/square/product-6.jpg",
        name: "Contrasting sheepskin sweatshirt",
        variant: "XL/Blue",
        qty: 1,
        price: "$60.00",
      },
    ],
  },
  {
    orderNumber: "S184989823",
    status: "canceled",
    statusLabel: "Canceled",
    statusClass: "stt-canceled",
    showCancelOrder: false,
    items: [
      {
        img: "/assets/images/product/square/product-8.jpg",
        name: "Contrasting sheepskin sweatshirt",
        variant: "XL/Blue",
        qty: 1,
        price: "$60.00",
      },
    ],
  },
];

export default function AccountOrders() {
  const [activeTabId, setActiveTabId] = useState<string>(DEFAULT_TAB_ID);

  const visibleOrders = useMemo(() => {
    if (activeTabId === "all-order") return ORDERS;
    return ORDERS.filter((o) => o.status === activeTabId);
  }, [activeTabId]);

  return (
    <AccountSection
      title="Your Orders"
      sectionClassName="flat-spacing flat-animate-tab"
    >
      <div className="account-my_order">
        <ul className="tab-btn-wrap-v1 style-2" role="tablist">
          {ORDER_TABS.map((tab) => (
            <li key={tab.id} className="nav-tab-item" role="presentation">
              <a
                href="#"
                role="tab"
                aria-selected={tab.id === activeTabId}
                className={`tf-btn-tab ${tab.id === activeTabId ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTabId(tab.id);
                }}
              >
                <span className="h6 fw-medium">{tab.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="tab-content">
          <div
            className="tab-pane fade active show"
            role="tabpanel"
            id={activeTabId}
          >
            <div className="my-order_list d-grid gap-24">
              {visibleOrders.map((order, orderIdx) => (
                <div
                  key={`${order.orderNumber}-${order.status}-${orderIdx}`}
                  className="wg-my-order"
                >
                  <div className="order-heading">
                    <div className="order_number fw-medium">
                      Order Number:
                      <span className="number-code fw-semibold">
                        {order.orderNumber}
                      </span>
                    </div>
                    <div className="order_status fw-medium">
                      Order Status:
                      <div
                        className={`tb-order_status text-label ${order.statusClass}`}
                      >
                        {order.statusLabel}
                      </div>
                    </div>
                  </div>
                  <div className="order-content">
                    {order.items.map((item, i) => (
                      <div
                        key={`${order.orderNumber}-${order.status}-${orderIdx}-${i}`}
                        className="order_prd_item"
                      >
                        <div className="prd__image">
                          <Image
                            loading="lazy"
                            width={100}
                            height={100}
                            src={item.img}
                            alt=""
                          />
                        </div>
                        <div className="prd__info">
                          <p className="name fw-medium">{item.name}</p>
                          <p className="type cl-text-2">{item.variant}</p>
                        </div>
                        <div className="prd__price fw-medium">
                          <span className="quantity">{item.qty}</span>x
                          <span className="price">{item.price}</span>
                        </div>
                      </div>
                    ))}
                    <div className="group-btn">
                      <a
                        href="#orderDetail"
                        data-bs-toggle="modal"
                        className="action-order tf-btn small animate-btn"
                      >
                        Order Details
                      </a>
                      {order.showCancelOrder ? (
                        <a
                          href="#"
                          className="action-order tf-btn btn-stroke small"
                        >
                          Cancel Order
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AccountSection>
  );
}
