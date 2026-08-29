import { createClient } from "./client";
import type { CartProduct } from "@/context/store";
import type { Json } from "@/types/supabase";

// All helpers accept userId directly — never call getUser() here
// so they can safely be used inside onAuthStateChange without GoTrue deadlocking.

export type CartSyncMode = "merge" | "replace";

function buildCartRows(userId: string, items: CartProduct[]) {
  return items.map((item) => ({
    user_id: userId,
    product_id: item.configurationKey,
    quantity: item.quantity,
    selected_color: item.selectedColor ?? null,
    selected_size: item.selectedSize ?? null,
    product_data: item as unknown as Json,
  }));
}

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
    configurationKey:
      ((row.product_data as unknown as CartProduct | null)?.configurationKey ??
        row.product_id),
  }));
}

export async function upsertCartItem(userId: string, item: CartProduct): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("cart_items")
    .upsert(buildCartRows(userId, [item]), { onConflict: "user_id,product_id" });

  if (error) {
    throw error;
  }
}

export async function updateCartItemQuantity(
  userId: string,
  productId: string | number,
  quantity: number,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("user_id", userId)
    .eq("product_id", String(productId));

  if (error) {
    throw error;
  }
}

export async function removeCartItem(userId: string, productId: string | number): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", String(productId));

  if (error) {
    throw error;
  }
}

export async function clearServerCart(userId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("cart_items").delete().eq("user_id", userId);

  if (error) {
    throw error;
  }
}

export async function syncLocalCartToServer(
  userId: string,
  localItems: CartProduct[],
  options: { mode?: CartSyncMode } = {},
): Promise<void> {
  const supabase = createClient();
  const mode = options.mode ?? "merge";

  if (mode === "replace") {
    if (localItems.length === 0) {
      await clearServerCart(userId);
      return;
    }

    const { data: existingItems, error: existingItemsError } = await supabase
      .from("cart_items")
      .select("product_id")
      .eq("user_id", userId);

    if (existingItemsError) {
      throw existingItemsError;
    }

    const localItemKeys = new Set(
      localItems.map((item) => item.configurationKey),
    );
    const staleProductIds = (existingItems ?? [])
      .map((item) => item.product_id)
      .filter((productId) => !localItemKeys.has(productId));

    if (staleProductIds.length > 0) {
      const { error: deleteError } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId)
        .in("product_id", staleProductIds);

      if (deleteError) {
        throw deleteError;
      }
    }
  } else if (localItems.length === 0) {
    return;
  }

  const { error } = await supabase
    .from("cart_items")
    .upsert(buildCartRows(userId, localItems), { onConflict: "user_id,product_id" });

  if (error) {
    throw error;
  }
}
