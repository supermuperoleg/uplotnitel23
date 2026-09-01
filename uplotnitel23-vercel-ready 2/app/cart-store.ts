export type CartItem = { key: string; title: string; sku: string; price: number; priceLabel: string };
const CART_KEY = "u23_cart";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try { const value = JSON.parse(localStorage.getItem(CART_KEY) ?? "[]"); return Array.isArray(value) ? value : []; } catch { return []; }
}
export function writeCart(items: CartItem[]) { localStorage.setItem(CART_KEY, JSON.stringify(items)); window.dispatchEvent(new Event("u23-cart-change")); }
export function addCartItem(item: CartItem) { writeCart([...readCart(), item]); }
export function removeCartItem(index: number) { writeCart(readCart().filter((_, itemIndex) => itemIndex !== index)); }
