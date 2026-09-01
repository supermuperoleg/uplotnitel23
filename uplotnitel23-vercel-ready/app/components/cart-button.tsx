"use client";

import { useEffect, useState } from "react";
import { readCart } from "../cart-store";

export default function CartButton() {
  const [count, setCount] = useState(0);
  useEffect(() => { const update = () => setCount(readCart().length); update(); window.addEventListener("storage", update); window.addEventListener("u23-cart-change", update); return () => { window.removeEventListener("storage", update); window.removeEventListener("u23-cart-change", update); }; }, []);
  return <a className="cart-button" href="/cart" aria-label={`Корзина, товаров: ${count}`}><span aria-hidden="true">▱</span><b>{count}</b></a>;
}
