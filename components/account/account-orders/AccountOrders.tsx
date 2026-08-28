"use client";

import { useEffect, useMemo, useState } from "react";
import { AccountSection } from "@/components/account/AccountSection";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { Tables } from "@/types/supabase";
import { formatPrice } from "@/utils/formatPrice";

type Order = Tables<"orders">;
type OrderStatus = "pending" | "delivery" | "completed" | "canceled";

const STATUS_CONFIG: Record<OrderStatus, { label: string; cls: string }> = {
  pending:   { label: "Pending",   cls: "stt-pending" },
  delivery:  { label: "Delivery",  cls: "stt-delivery" },
  completed: { label: "Completed", cls: "stt-completed" },
  canceled:  { label: "Canceled",  cls: "stt-canceled" },
};

const TABS = [
  { id: "all-order", label: "All Order" },
  { id: "pending",   label: "Pending" },
  { id: "delivery",  label: "Delivery" },
  { id: "completed", label: "Completed" },
  { id: "canceled",  label: "Canceled" },
] as const;

export default function AccountOrders() {
  const { user } = useAuth();
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all-order");
  const [canceling, setCanceling] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("*").eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => { setOrders(data ?? []); setLoading(false); });
  }, [user]);

  const visible = useMemo(() =>
    activeTab === "all-order" ? orders : orders.filter(o => o.status === activeTab),
    [orders, activeTab]
  );

  async function cancelOrder(orderId: string) {
    setCanceling(orderId);
    await supabase.from("orders").update({ status: "canceled" }).eq("id", orderId);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "canceled" } : o));
    setCanceling(null);
  }

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
                  const cfg = STATUS_CONFIG[order.status as OrderStatus] ?? STATUS_CONFIG.pending;
                  const items = Array.isArray(order.items) ? order.items as Record<string, unknown>[] : [];
                  const canCancel = order.status === "pending" || order.status === "delivery";
                  return (
                    <div key={order.id} className="wg-my-order">
                      <div className="order-heading">
                        <div className="order_number fw-medium">
                          Order: <span className="number-code fw-semibold">{order.order_number}</span>
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
                              <p className="name fw-medium">{String(item.name ?? "Product")}</p>
                              {item.variant && <p className="type cl-text-2">{String(item.variant)}</p>}
                            </div>
                            <div className="prd__price fw-medium">
                              <span className="quantity">{Number(item.qty ?? 1)}</span>x
                              <span className="price">{formatPrice(Number(item.price ?? 0))}</span>
                            </div>
                          </div>
                        ))}
                        <div className="group-btn d-flex gap-8 mt-12">
                          <span className="fw-medium cl-text-2">
                            Total: <strong>{formatPrice(order.total_price)}</strong>
                          </span>
                          {canCancel && (
                            <button
                              className="action-order tf-btn btn-stroke small ms-auto"
                              disabled={canceling === order.id}
                              onClick={() => cancelOrder(order.id)}
                            >
                              {canceling === order.id ? "Canceling…" : "Cancel Order"}
                            </button>
                          )}
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
