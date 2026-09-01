"use client";

import { useState, type FormEvent } from "react";
import type { ManagedProduct } from "../data/managed-products";

export default function AdminClient({ initialProducts, username }: { initialProducts: ManagedProduct[]; username: string }) {
  const [products, setProducts] = useState(initialProducts);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true); setMessage("");
    const form = event.currentTarget;
    const response = await fetch("/api/admin/products", { method: "POST", body: new FormData(form) });
    const result = await response.json() as { ok?: boolean; error?: string };
    setSaving(false);
    if (!response.ok) { setMessage(result.error ?? "Не удалось добавить товар"); return; }
    form.reset();
    setMessage("Товар добавлен. Каталог и фильтры обновлены.");
    window.setTimeout(() => window.location.reload(), 500);
  }

  async function remove(product: ManagedProduct) {
    if (!window.confirm(`Удалить товар «${product.title}»?`)) return;
    const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    const result = await response.json() as { error?: string };
    if (!response.ok) { setMessage(result.error ?? "Не удалось удалить товар"); return; }
    setProducts((items) => items.filter((item) => item.id !== product.id));
    setMessage("Товар удалён из каталога.");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.assign("/admin/login");
  }

  return <section className="section shell admin-panel">
    <div className="admin-sessionbar"><span>Владелец: <b>{username}</b></span><button type="button" onClick={logout}>Выйти из панели</button></div>
    <div className="admin-layout">
      <form className="admin-form" onSubmit={submit}>
        <div className="admin-form-head"><span>Новая карточка</span><h2>Добавить товар</h2><p>Обязательные поля отмечены звёздочкой.</p></div>
        <label>Название товара *<input name="title" required placeholder="Уплотнитель двери холодильника Atlant…"/></label>
        <div className="admin-fields"><label>Артикул *<input name="sku" required placeholder="Например, 3010"/></label><label>Цена<input name="price" placeholder="Например, 2 490 ₽"/></label></div>
        <div className="admin-fields"><label>Категория *<input name="category" required list="category-list" placeholder="Бытовые холодильники"/><datalist id="category-list"><option value="Бытовые холодильники"/><option value="Морозильное оборудование"/><option value="Торговое оборудование"/><option value="Комплектующие"/></datalist></label><label>Производитель *<input name="brandLabel" required placeholder="Atlant (Атлант)"/></label></div>
        <label>Варианты названия бренда<input name="brandAliases" placeholder="Atlant, Атлант — через запятую"/><small>Нужны для поиска бренда кириллицей и латиницей.</small></label>
        <div className="admin-fields"><label>Высота, см<input name="height" inputMode="decimal" placeholder="154,5"/></label><label>Ширина, см<input name="width" inputMode="decimal" placeholder="65,5"/></label></div>
        <label>Описание<textarea name="description" rows={5} placeholder="Совместимость, тип профиля, цвет и особенности установки"/></label>
        <label className="admin-upload">Фото товара<input name="photo" type="file" accept="image/jpeg,image/png,image/webp"/><small>JPG, PNG или WebP, до 8 МБ.</small></label>
        <button className="admin-submit" type="submit" disabled={saving}>{saving ? "Сохраняем…" : "Добавить в каталог →"}</button>
        {message && <p className="admin-message" role="status">{message}</p>}
      </form>
      <div className="admin-list"><div className="admin-list-head"><div><span>Добавлено вручную</span><h2>Товары</h2></div><b>{products.length}</b></div>{products.length === 0 ? <div className="admin-empty">Здесь появятся товары, добавленные через панель.</div> : products.map((product) => <article key={product.id}>{product.imageUrl ? <img src={product.imageUrl} alt=""/> : <span className="admin-thumb"><i/></span>}<div><small>АРТ. {product.sku} · {product.brandLabel}</small><h3>{product.title}</h3><p>{product.category}{product.height && product.width ? ` · ${product.height} × ${product.width} см` : ""}</p></div><button type="button" onClick={() => remove(product)}>Удалить</button></article>)}</div>
    </div>
  </section>;
}
