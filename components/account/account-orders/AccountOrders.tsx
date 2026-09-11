"use client";

import { useEffect, useMemo, useState } from "react";

import { AccountSection } from "@/components/account/AccountSection";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/utils/formatPrice";
import type { AccountOrder } from "@/types/medusa";

type OrderStatus = AccountOrder["status"];

const STATUS_CONFIG: Record<OrderStatus, { label: string; cls: string }> = {
  pending:   { label: "Pending",   cls: "stt-pending" },
  requires_action: { label: "Action Needed", cls: "stt-delivery" },
  completed: { label: "Completed", cls: "stt-completed" },
  canceled: { label: "Canceled", cls: "stt-canceled" },
  draft: { label: "Draft", cls: "stt-pending" },
  archived: { label: "Archived", cls: "stt-completed" },
};

const TABS = [
  { id: "all-order", label: "All Order" },
  { id: "pending",   label: "Pending" },
  { id: "requires_action", label: "Action Needed" },
  { id: "completed", label: "Completed" },
  { id: "canceled",  label: "Canceled" },
] as const;

export default function AccountOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all-order");

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    let isCancelled = false;

    async function loadOrders() {
      try {
        const response = await fetch("/api/account/orders", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });
        const payload = (await response.json()) as {
          orders?: AccountOrder[];
        };

        if (!response.ok || isCancelled) {
          return;
        }

        setOrders(payload.orders ?? []);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    void loadOrders();

    return () => {
      isCancelled = true;
    };
  }, [user]);

  const visible = useMemo(() =>
    activeTab === "all-order" ? orders : orders.filter(o => o.status === activeTab),
    [orders, activeTab]
  );

  return (
    <AccountSection title="Your Orders" sectionClassName="flat-spacing flat-animate-tab">
      <div className="account-my_order">
        <ul className="tab-btn-wrap-v1 style-2" role="tablist">
          {TABS.map(tab => (
            <li key={tab.id} className="nav-tab-item" role="presentation">
              <a href="#" role="tab" aria-selected={tab.id === activeTab}
                className={`tf-btn-tab ${tab.id === activeTab ? "active" : ""}`}
                onClick={e => { e.preventDefault(); setActiveTab(tab.id); }}>
                <span className="h6 fw-medium">{tab.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="tab-content">
          <div className="tab-pane fade active show" role="tabpanel">
            {loading ? (
              <p className="cl-text-2 py-4 text-center">Loading orders…</p>
            ) : visible.length === 0 ? (
              <div className="text-center py-5">
                <i className="icon icon-ShoppingBag fs-48 cl-text-3 d-block mb-12" />
                <p className="cl-text-2">No orders found.</p>
              </div>
            ) : (
              <div className="my-order_list d-grid gap-24">
                {visible.map(order => {
                  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                  const items = order.items ?? [];
                  return (
                    <div key={order.id} className="wg-my-order">
                      <div className="order-heading">
                        <div className="order_number fw-medium">
                          Order: <span className="number-code fw-semibold">
                            {order.displayId != null ? `#${order.displayId}` : order.id}
                          </span>
                        </div>
                        <div className="order_status fw-medium d-flex align-items-center gap-8">
                          Status:
                          <div className={`tb-order_status text-label ${cfg.cls}`}>{cfg.label}</div>
                        </div>
                      </div>
                      <div className="order-content">
                        {items.length === 0 ? (
                          <p className="cl-text-2 py-2">No items in this order.</p>
                        ) : items.map((item, i) => (
                          <div key={i} className="order_prd_item">
                            <div className="prd__info">
                              <p className="name fw-medium">{item.name}</p>
                              {item.variant && <p className="type cl-text-2">{item.variant}</p>}
                            </div>
                            <div className="prd__price fw-medium">
                              <span className="quantity">{item.quantity}</span>x
                              <span className="price">{formatPrice(item.unitPrice)}</span>
                            </div>
                          </div>
                        ))}
                        <div className="group-btn d-flex gap-8 mt-12">
                          <span className="fw-medium cl-text-2">
                            Total: <strong>{formatPrice(order.total)}</strong>
                          </span>
                          <span className="cl-text-2 ms-auto">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AccountSection>
  );
}
