"use client";

import { useEffect, useState } from "react";
import { readCart, removeCartItem, type CartItem } from "../cart-store";

function formatPrice(value: number) { return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`; }

export default function CartClient() {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => { const update = () => setItems(readCart()); update(); window.addEventListener("storage", update); window.addEventListener("u23-cart-change", update); return () => { window.removeEventListener("storage", update); window.removeEventListener("u23-cart-change", update); }; }, []);
  const total = items.reduce((sum, item) => sum + item.price, 0);

  function remove(index: number) { removeCartItem(index); setItems(readCart()); }
  function sendOrder() {
    const lines = items.map((item, index) => `${index + 1}. ${item.title}, арт. ${item.sku} — ${item.priceLabel}`);
    const body = ["Заказ с сайта Уплотнитель23", "", ...lines, "", `Предварительная стоимость: ${formatPrice(total)}`, "", "Имя:", "Телефон:"].join("\n");
    window.location.href = `mailto:zapthasti2019@mail.ru?subject=${encodeURIComponent("Заказ с сайта")}&body=${encodeURIComponent(body)}`;
  }

  return <section className="section shell cart-page">
    {items.length === 0 ? <div className="cart-empty"><span className="mini-profile"/><h2>Корзина пока пуста</h2><p>Добавьте уплотнители из каталога — они появятся здесь.</p><a className="primary-link" href="/catalog">Перейти в каталог →</a></div> : <div className="cart-layout">
      <div className="cart-list">{items.map((item, index) => <article key={`${item.key}-${index}`}><div className="cart-thumb"><span className="mini-profile"/></div><div><small>АРТ. {item.sku}</small><h2>{item.title}</h2></div><b>{item.priceLabel}</b><button type="button" onClick={() => remove(index)} aria-label={`Удалить ${item.title}`}>×</button></article>)}</div>
      <aside className="cart-summary"><span>Итого</span><b>{formatPrice(total)}</b><p>Стоимость предварительная. Менеджер подтвердит совместимость, наличие и итоговую цену.</p><button type="button" onClick={sendOrder}>Оформить по e-mail →</button></aside>
    </div>}
  </section>;
}
