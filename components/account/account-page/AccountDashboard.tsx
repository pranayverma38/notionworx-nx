"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AccountSection } from "@/components/account/AccountSection";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/utils/formatPrice";
import type { Tables } from "@/types/supabase";

type Order = Tables<"orders">;

export default function AccountDashboard() {
  const { user } = useAuth();
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("*").eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => { setOrders(data ?? []); setLoading(false); });
  }, [user]);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    completed: orders.filter(o => o.status === "completed").length,
    canceled: orders.filter(o => o.status === "canceled").length,
  };

  const recentOrders = orders.slice(0, 5);

  const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
    pending:   { label: "Pending",   cls: "stt-pending" },
    delivery:  { label: "Delivery",  cls: "stt-delivery" },
    completed: { label: "Completed", cls: "stt-completed" },
    canceled:  { label: "Canceled",  cls: "stt-canceled" },
  };

  return (
    <AccountSection title="Dashboard">
      {/* Stats row */}
      <div className="acount-order_stats mb-24">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px" }}>
          {[
            { label: "Total Orders", count: stats.total, icon: "icon-ShoppingBag" },
            { label: "Pending",      count: stats.pending,   icon: "icon-Clock" },
            { label: "Completed",    count: stats.completed, icon: "icon-CheckCircle" },
            { label: "Cancelled",    count: stats.canceled,  icon: "icon-XCircle" },
          ].map(stat => (
            <div key={stat.label} className="order-box">
              <div className="order_info">
                <p className="info__label cl-text-2">{stat.label}</p>
                <h5 className="info__count type-semibold">{loading ? "—" : stat.count}</h5>
              </div>
              <div className="order_icon">
                <i className={`icon ${stat.icon}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div className="account-my_recent">
        <h6 className="title-case">Recent Orders</h6>
        {loading ? (
          <p className="cl-text-2 py-3">Loading…</p>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-5">
            <p className="cl-text-2">No orders yet. Start shopping!</p>
            <Link href="/shop-default" className="tf-btn animate-btn mt-12">Shop Now</Link>
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="table-my_recent">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => {
                  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                  return (
                    <tr key={order.id} className="tb-order-item">
                      <td className="tb-order_code fw-medium">{order.order_number}</td>
                      <td className="tb-order_price fw-medium">{formatPrice(order.total_price)}</td>
                      <td className="cl-text-2" style={{ fontSize: "0.85rem" }}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <div className={`tb-order_status text-label ${cfg.cls}`}>{cfg.label}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {recentOrders.length > 0 && (
          <div className="mt-16">
            <Link href="/account-orders" className="tf-btn btn-stroke small">View All Orders</Link>
          </div>
        )}
      </div>
    </AccountSection>
  );
}
