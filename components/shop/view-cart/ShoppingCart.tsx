"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import CartAddOnSummary from "@/components/common/CartAddOnSummary";
import { useContextElement, type CartProduct } from "@/context/Context";
import type { ProductId } from "@/context/store";
import { formatPrice } from "@/utils/formatPrice";

const FREE_SHIPPING_THRESHOLD = 250;
const DEPOSIT_ELIGIBILITY_THRESHOLD = 295;
const MIN_DEPOSIT = 100;

const CART_STYLES = `
  .cart-layout { display: grid; grid-template-columns: 1fr; gap: 24px; }
  @media (min-width: 992px) { .cart-layout { grid-template-columns: 1fr 380px; } }
  .cart-item-card { background:#fff; border-radius:16px; padding:20px; box-shadow:0 1px 4px rgba(0,0,0,0.06); transition:box-shadow 0.2s; overflow:hidden; }
  .cart-item-card:hover { box-shadow:0 4px 24px rgba(0,0,0,0.09); }
  .cart-item-row { display:flex; gap:16px; align-items:flex-start; width:100%; }
  .cart-item-thumb { flex-shrink:0; width:90px; height:90px; border-radius:10px; overflow:hidden; background:#f3f4f6; display:block; position:relative; }
  .cart-item-body { flex:1; min-width:0; }
  .cart-item-name { font-weight:600; font-size:0.95rem; color:#111; text-decoration:none; display:block; line-height:1.4; margin-bottom:6px; word-break:break-word; }
  .cart-item-name:hover { color:var(--primary); }
  .cart-item-footer { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-top:12px; }
  .cart-remove-btn { flex-shrink:0; background:none; border:none; cursor:pointer; color:#d1d5db; font-size:18px; padding:4px; line-height:1; transition:color 0.15s; align-self:flex-start; }
  .cart-remove-btn:hover { color:var(--primary); }
  .qty-stepper { display:flex; align-items:center; border:1.5px solid #e5e7eb; border-radius:10px; overflow:hidden; }
  .qty-btn { width:36px; height:36px; border:none; background:#f9fafb; cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center; transition:background 0.15s, color 0.15s; }
  .qty-btn:hover { background:#111; color:#fff; }
  .qty-val { min-width:32px; text-align:center; font-weight:600; font-size:0.9rem; }
  .ship-bar-track { height:6px; background:#e5e7eb; border-radius:99px; overflow:hidden; min-width:100px; }
  .checkout-btn { display:block; background:#111; color:#fff; text-align:center; padding:16px; border-radius:12px; font-weight:700; font-size:1rem; text-decoration:none; letter-spacing:0.01em; margin-bottom:12px; transition:background 0.2s; }
  .checkout-btn:hover { background:#333; color:#fff; }
  .deposit-panel {
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transform: translateY(-6px);
    transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1),
                opacity 0.3s ease,
                transform 0.3s ease,
                margin-top 0.3s ease;
    margin-top: 0;
    pointer-events: none;
  }
  .deposit-panel.open {
    max-height: 220px;
    opacity: 1;
    transform: translateY(0);
    margin-top: 12px;
    pointer-events: auto;
  }
  @media (max-width:480px) {
    .cart-item-thumb { width:72px !important; height:72px !important; }
    .cart-item-name { font-size:0.85rem !important; }
    .cart-item-row { gap:12px; }
  }
`;

export default function ShoppingCart() {
  const { cartProducts, updateQuantity, totalPrice, removeFromCart } = useContextElement();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [payMode, setPayMode] = useState<"full" | "deposit">("full");
  const [depositAmount, setDepositAmount] = useState("100");

  const discount = 0;
  const orderTotal = Math.max(0, totalPrice - discount);
  const depositEligible = orderTotal > DEPOSIT_ELIGIBILITY_THRESHOLD;
  const parsedDeposit = Math.max(MIN_DEPOSIT, Math.min(orderTotal, parseFloat(depositAmount) || MIN_DEPOSIT));
  const amountDue = payMode === "full" ? orderTotal : parsedDeposit;
  const amountToFreeship = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);
  const shipProgress = Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100);

  useEffect(() => {
    if (!depositEligible && payMode === "deposit") {
      setPayMode("full");
    }
  }, [depositEligible, payMode]);

  const removeLine = (id: ProductId) => removeFromCart(id);
  const setQty = (id: ProductId, qty: number) => {
    if (qty < 1) { removeLine(id); return; }
    updateQuantity(id, qty);
  };

  const freeshipMsg = useMemo(() => {
    if (totalPrice >= FREE_SHIPPING_THRESHOLD)
      return <span>🎉 You qualify for <strong style={{ color: "#16a34a" }}>free shipping</strong>!</span>;
    return <span>Add <strong style={{ color: "var(--primary)" }}>{formatPrice(amountToFreeship)}</strong> more to unlock free shipping</span>;
  }, [amountToFreeship, totalPrice]);

  if (cartProducts.length === 0) {
    return (
      <section style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 20px" }}>
        <div style={{ textAlign: "center", maxWidth: "420px" }}>
          <div style={{ fontSize: "80px", marginBottom: "24px", opacity: 0.15 }}>🛒</div>
          <h3 style={{ fontWeight: 700, marginBottom: "12px" }}>Your cart is empty</h3>
          <p style={{ color: "#6b7280", marginBottom: "32px", lineHeight: 1.6 }}>
            Looks like you haven&apos;t added anything yet. Explore our store and find something you love.
          </p>
          <Link href="/shop-default" className="tf-btn animate-btn" style={{ display: "inline-block", padding: "14px 36px" }}>
            Start Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: "48px 0 80px", background: "#f9fafb", overflowX: "hidden" }}>
      <style>{CART_STYLES}</style>
      <div className="container">

        {/* Title */}
        <div style={{ marginBottom: "28px" }}>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(1.5rem, 3vw, 2rem)", letterSpacing: "-0.02em", margin: 0 }}>
            Shopping Cart{" "}
            <span style={{ fontSize: "1rem", fontWeight: 500, color: "#6b7280" }}>
              ({cartProducts.length} item{cartProducts.length !== 1 ? "s" : ""})
            </span>
          </h2>
        </div>

        {/* Free shipping bar */}
        <div style={{
          background: totalPrice >= FREE_SHIPPING_THRESHOLD ? "#f0fdf4" : "#fffbeb",
          border: `1px solid ${totalPrice >= FREE_SHIPPING_THRESHOLD ? "#bbf7d0" : "#fde68a"}`,
          borderRadius: "12px", padding: "14px 20px", marginBottom: "16px",
          display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap"
        }}>
          <div style={{ flex: 1, fontSize: "0.9rem", minWidth: "180px" }}>{freeshipMsg}</div>
          <div className="ship-bar-track" style={{ flex: "0 0 120px" }}>
            <div style={{
              height: "100%", width: `${shipProgress}%`,
              background: totalPrice >= FREE_SHIPPING_THRESHOLD ? "#16a34a" : "var(--primary)",
              borderRadius: "99px", transition: "width 0.4s ease"
            }} />
          </div>
        </div>

        {/* Deposit notice */}
        <div style={{
          background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "12px",
          padding: "12px 18px", marginBottom: "28px", display: "flex", gap: "10px",
          alignItems: "flex-start", fontSize: "0.86rem", color: "#92400e"
        }}>
          <span>🔥</span>
          <span>
            Deposit option applies only to orders over <strong>$295 USD</strong>. Orders below this amount require <strong>full payment</strong>.
          </span>
        </div>

        <div className="cart-layout">

          {/* ── Cart items ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {cartProducts.map(item => (
              <CartCard
                key={item.configurationKey}
                item={item}
                onRemove={() => removeLine(item.configurationKey)}
                onQtyChange={qty => setQty(item.configurationKey, qty)}
              />
            ))}

            {/* Coupon */}
            <div style={{
              background: "#fff", borderRadius: "16px", padding: "20px 24px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", gap: "12px", flexWrap: "wrap"
            }}>
              <input
                type="text"
                value={coupon}
                onChange={e => setCoupon(e.target.value)}
                placeholder="Enter voucher / discount code"
                style={{
                  flex: "1 1 200px", border: "1.5px solid #e5e7eb", borderRadius: "10px",
                  padding: "12px 16px", fontSize: "0.9rem", outline: "none", fontFamily: "inherit"
                }}
              />
              <button
                onClick={() => { if (coupon.trim()) setCouponApplied(true); }}
                className="tf-btn animate-btn"
                style={{ padding: "12px 28px", borderRadius: "10px", fontSize: "0.9rem", whiteSpace: "nowrap" }}
              >
                Apply Code
              </button>
              {couponApplied && <p style={{ width: "100%", color: "#16a34a", fontSize: "0.85rem", margin: 0 }}>✓ Coupon applied!</p>}
            </div>
          </div>

          {/* ── Order summary ── */}
          <div>
            <div style={{
              background: "#fff", borderRadius: "20px", padding: "28px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)", position: "sticky", top: "100px"
            }}>
              <h4 style={{ fontWeight: 700, marginBottom: "20px", fontSize: "1.2rem" }}>Order Summary</h4>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                <SummaryRow label="Subtotal" value={formatPrice(totalPrice)} />
                <SummaryRow label="Discounts" value={discount > 0 ? `-${formatPrice(discount)}` : formatPrice(0)} muted={discount === 0} />
                <SummaryRow label="Shipping" value="Free" green />
              </div>

              <div style={{ borderTop: "2px solid #f3f4f6", paddingTop: "16px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, fontSize: "1rem" }}>Order Total</span>
                  <span style={{ fontWeight: 800, fontSize: "1.35rem", letterSpacing: "-0.02em" }}>{formatPrice(orderTotal)}</span>
                </div>
              </div>

              {/* ── Payment mode toggle ── */}
              <div style={{ marginBottom: "16px" }}>
                <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "#374151", marginBottom: "10px" }}>Payment Option</p>
                {/* Sliding pill toggle */}
                <div style={{
                  display: "grid", gridTemplateColumns: depositEligible ? "1fr 1fr" : "1fr 1fr",
                  background: "#f3f4f6", borderRadius: "12px", padding: "4px",
                  position: "relative"
                }}>
                  {(["full", "deposit"] as const).map(mode => {
                    const isDepositMode = mode === "deposit";
                    const disabled = isDepositMode && !depositEligible;

                    return (
                    <button key={mode} onClick={() => setPayMode(mode)} style={{
                      padding: "9px 8px", borderRadius: "9px", cursor: "pointer",
                      border: "none",
                      background: payMode === mode ? "#111" : "transparent",
                      color: disabled ? "#9ca3af" : payMode === mode ? "#fff" : "#6b7280",
                      opacity: disabled ? 0.7 : 1,
                      fontWeight: 600, fontSize: "0.82rem",
                      transition: "background 0.25s, color 0.25s",
                      textAlign: "center" as const, zIndex: 1, position: "relative"
                    }}
                      disabled={disabled}
                    >
                      {mode === "full" ? "💳 Pay in Full" : "📦 Pay Deposit"}
                    </button>
                    );
                  })}
                </div>
                {!depositEligible && (
                  <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "8px", marginBottom: 0 }}>
                    Deposit is available only when your order total is above {formatPrice(DEPOSIT_ELIGIBILITY_THRESHOLD)}.
                  </p>
                )}

                {/* Deposit amount input — always rendered, CSS drives open/close */}
                <div className={`deposit-panel${payMode === "deposit" ? " open" : ""}`}
                  style={{ background: "#f9fafb", borderRadius: "10px", padding: "0 14px" }}>
                  <div style={{ padding: "14px 0" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: "8px" }}>
                      Deposit Amount <span style={{ color: "#6b7280", fontWeight: 400 }}>(min ${MIN_DEPOSIT})</span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{
                        position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                        fontWeight: 600, color: "#374151", fontSize: "0.9rem"
                      }}>$</span>
                      <input
                        type="number"
                        min={MIN_DEPOSIT}
                        max={orderTotal}
                        value={depositAmount}
                        onChange={e => setDepositAmount(e.target.value)}
                        style={{
                          width: "100%", padding: "10px 12px 10px 24px", border: "1.5px solid #e5e7eb",
                          borderRadius: "8px", fontSize: "0.9rem", fontFamily: "inherit", outline: "none",
                          fontWeight: 600
                        }}
                      />
                    </div>
                    {parsedDeposit < orderTotal && (
                      <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "6px", marginBottom: 0 }}>
                        Remaining <strong>{formatPrice(orderTotal - parsedDeposit)}</strong> due before delivery.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Amount due */}
              <div style={{
                background: payMode === "deposit" ? "#fffbeb" : "#f0fdf4",
                border: `1px solid ${payMode === "deposit" ? "#fde68a" : "#bbf7d0"}`,
                borderRadius: "10px", padding: "12px 16px", marginBottom: "16px",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <span style={{ fontWeight: 600, fontSize: "0.88rem", color: "#374151" }}>
                  {payMode === "deposit" ? "Due Today" : "Total Due"}
                </span>
                <span style={{ fontWeight: 800, fontSize: "1.25rem", color: "#111" }}>
                  {formatPrice(amountDue)}
                </span>
              </div>
              <p style={{ fontSize: "0.73rem", color: "#9ca3af", marginBottom: "16px" }}>Tax included. Shipping calculated at checkout.</p>

              <Link href="/checkout" className="checkout-btn">Proceed to Checkout →</Link>

              <Link href="/shop-default" style={{
                display: "block", textAlign: "center", color: "#6b7280",
                fontSize: "0.88rem", textDecoration: "underline", textUnderlineOffset: "3px"
              }}>
                Or continue shopping
              </Link>

              {/* Trust badges */}
              <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #f3f4f6" }}>
                <div style={{ display: "flex", justifyContent: "space-around", gap: "8px" }}>
                  {(["🔒 Secure", "🚚 Free Ship", "↩️ Returns"] as const).map(label => (
                    <div key={label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "0.72rem", color: "#9ca3af" }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>{/* end cart-layout */}
      </div>
    </section>
  );
}

function CartCard({ item, onRemove, onQtyChange }: {
  item: CartProduct;
  onRemove: () => void;
  onQtyChange: (qty: number) => void;
}) {
  const imgSrc = item.img ?? item.images?.[0]?.src ?? "/assets/images/product/product-1.jpg";
  const colorLabel = item.selectedColor ?? item.colors?.[0]?.label ?? null;
  const sizeLabel = item.selectedSize ?? null;
  const lineTotal = item.price * item.quantity;

  return (
    <div className="cart-item-card">
      <div className="cart-item-row">
        {/* Thumbnail */}
        <Link href={`/product-detail/${item.id}`} className="cart-item-thumb">
          <Image src={imgSrc} alt={item.name} fill style={{ objectFit: "cover" }} sizes="90px" />
        </Link>

        {/* Info */}
        <div className="cart-item-body">
          <Link href={`/product-detail/${item.id}`} className="cart-item-name">{item.name}</Link>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {colorLabel && (
              <span style={{ fontSize: "0.75rem", color: "#6b7280", background: "#f3f4f6", borderRadius: "6px", padding: "2px 8px" }}>
                Color: {colorLabel}
              </span>
            )}
            {sizeLabel && (
              <span style={{ fontSize: "0.75rem", color: "#6b7280", background: "#f3f4f6", borderRadius: "6px", padding: "2px 8px" }}>
                Size: {sizeLabel}
              </span>
            )}
          </div>
          <CartAddOnSummary item={item} />

          <div className="cart-item-footer">
            <div className="qty-stepper">
              <button className="qty-btn" onClick={() => onQtyChange(item.quantity - 1)} aria-label="Decrease">−</button>
              <span className="qty-val">{item.quantity}</span>
              <button className="qty-btn" onClick={() => onQtyChange(item.quantity + 1)} aria-label="Increase">+</button>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700, fontSize: "1rem", color: "#111" }}>{formatPrice(lineTotal)}</div>
              {item.quantity > 1 && (
                <div style={{ fontSize: "0.73rem", color: "#9ca3af" }}>{formatPrice(item.price)} each</div>
              )}
            </div>
          </div>
        </div>

        {/* Remove */}
        <button className="cart-remove-btn" onClick={onRemove} aria-label="Remove item" title="Remove">✕</button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, muted, green }: { label: string; value: string; muted?: boolean; green?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>{label}</span>
      <span style={{ fontWeight: 600, fontSize: "0.9rem", color: green ? "#16a34a" : muted ? "#9ca3af" : "#111" }}>{value}</span>
    </div>
  );
}
