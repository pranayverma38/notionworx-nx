import { createClient } from "./client";
import type { CartProduct } from "@/context/store";
import type { Json } from "@/types/supabase";

// All helpers accept userId directly — never call getUser() here
// so they can safely be used inside onAuthStateChange without GoTrue deadlocking.

export async function fetchCartFromServer(userId: string): Promise<CartProduct[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    ...(row.product_data as unknown as CartProduct),
    quantity: row.quantity,
    selectedColor: row.selected_color ?? undefined,
    selectedSize: row.selected_size ?? undefined,
  }));
}

export async function upsertCartItem(userId: string, item: CartProduct): Promise<void> {
  const supabase = createClient();
  await supabase.from("cart_items").upsert(
    {
      user_id: userId,
      product_id: String(item.id),
      quantity: item.quantity,
      selected_color: item.selectedColor ?? null,
      selected_size: item.selectedSize ?? null,
      product_data: item as unknown as Json,
    },
    { onConflict: "user_id,product_id" },
  );
}

export async function updateCartItemQuantity(
  userId: string,
  productId: string | number,
  quantity: number,
): Promise<void> {
  const supabase = createClient();
  await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("user_id", userId)
    .eq("product_id", String(productId));
}

export async function removeCartItem(userId: string, productId: string | number): Promise<void> {
  const supabase = createClient();
  await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", String(productId));
}

export async function clearServerCart(userId: string): Promise<void> {
  const supabase = createClient();
  await supabase.from("cart_items").delete().eq("user_id", userId);
}

export async function syncLocalCartToServer(
  userId: string,
  localItems: CartProduct[],
): Promise<void> {
  if (localItems.length === 0) return;
  const supabase = createClient();

  const rows = localItems.map((item) => ({
    user_id: userId,
    product_id: String(item.id),
    quantity: item.quantity,
    selected_color: item.selectedColor ?? null,
    selected_size: item.selectedSize ?? null,
    product_data: item as unknown as Json,
  }));

  await supabase
    .from("cart_items")
    .upsert(rows, { onConflict: "user_id,product_id" });
}
