"use client";

import { FormEvent, useMemo, useState } from "react";
import { SiteFooter, SiteHeader } from "./components/site-shell";
import { addCartItem } from "./cart-store";

const brands = ["Все", "Atlant", "Bosch", "Indesit", "LG", "Samsung", "Stinol", "Бирюса", "Liebherr"];
const brandSlugs: Record<string, string> = { Atlant: "atlant", Bosch: "bosch", Indesit: "indesit", LG: "lg", Samsung: "samsung", Stinol: "stinol", "Бирюса": "biryusa", Liebherr: "liebherr" };
const products = [
  { id: 1, brand: "Atlant", model: "ХМ 4008 / 4010", size: "560 × 1045 мм", mount: "в паз", price: 1490, code: "ATL-01" },
  { id: 2, brand: "Bosch", model: "KGV / KGN серия", size: "570 × 1010 мм", mount: "в паз", price: 1690, code: "BSH-03" },
  { id: 3, brand: "Indesit", model: "C 132 / C 138", size: "570 × 1035 мм", mount: "в паз", price: 1390, code: "IND-02" },
  { id: 4, brand: "LG", model: "GA-B409 / GA-B419", size: "595 × 1025 мм", mount: "в паз", price: 1890, code: "LG-07" },
  { id: 5, brand: "Samsung", model: "RL33 / RL34", size: "570 × 1050 мм", mount: "в паз", price: 1790, code: "SAM-04" },
  { id: 6, brand: "Stinol", model: "101 / 103 / 107", size: "560 × 1060 мм", mount: "под планку", price: 1290, code: "STN-01" },
];
const faqs = [
  ["Как понять, какой уплотнитель мне нужен?", "Пришлите марку и точную модель холодильника с заводской наклейки. Если маркировка стерлась, понадобятся размеры рамки и фотография профиля в разрезе."],
  ["Можно ли заменить уплотнитель самостоятельно?", "Да, большинство моделей устанавливается в паз без специального инструмента. Для каждого типа крепления мы подготовим понятную инструкцию."],
  ["Что делать, если моей модели нет в каталоге?", "Оставьте заявку на подбор. Проверим профиль по модели, размерам и фотографии, а затем предложим совместимый вариант или изготовление по размеру."],
  ["Как доставляется заказ?", "Отправляем по Краснодару и в другие регионы России. Стоимость и срок зависят от выбранной службы и населённого пункта."],
];

const price = (value: number) => new Intl.NumberFormat("ru-RU").format(value) + " ₽";

export default function Home() {
  const [brand, setBrand] = useState("Все");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((item) => (brand === "Все" || item.brand === brand) && (!needle || `${item.brand} ${item.model} ${item.code}`.toLowerCase().includes(needle)));
  }, [brand, query]);
  function addToCart(id: number) {
    const item = products.find((product) => product.id === id);
    if (!item) return;
    addCartItem({ key: `home-${item.id}`, title: `Уплотнитель ${item.brand} ${item.model}`, sku: item.code, price: item.price, priceLabel: price(item.price) });
    setNotice("Товар добавлен в корзину");
    window.setTimeout(() => setNotice(""), 2200);
  }
  function sendSelection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = ["Заявка на подбор уплотнителя", `Имя: ${data.get("name")}`, `Телефон: ${data.get("phone")}`, `Холодильник: ${data.get("model")}`].join("\n");
    window.location.href = `mailto:zapthasti2019@mail.ru?subject=${encodeURIComponent("Подбор уплотнителя")}&body=${encodeURIComponent(body)}`;
  }
  const storeSchema = { "@context": "https://schema.org", "@type": "Store", name: "Уплотнитель23", description: "Продажа и подбор уплотнителей для холодильников всех брендов", telephone: "+7 918 052-46-25", email: "zapthasti2019@mail.ru", address: { "@type": "PostalAddress", addressLocality: "Краснодар", streetAddress: "ул. Знаменская, 93/1", addressCountry: "RU" } };
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };

  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <SiteHeader />
    <section className="hero" id="top">
      <div className="blueprint blueprint-a" aria-hidden="true" /><div className="blueprint blueprint-b" aria-hidden="true" />
      <div className="shell hero-grid">
        <div className="hero-copy"><p className="eyebrow"><span /> Точное совпадение профиля</p><h1>Уплотнители для<br /><strong>любого холодильника</strong></h1><p className="hero-lead">Подберём уплотнитель по бренду, модели или фотографии. Для бытовых холодильников, морозильных камер, витрин и ларей.</p>
          <div className="search-box"><label htmlFor="hero-search">Марка или модель холодильника</label><div><input id="hero-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Например, Samsung RL34" /><a href="#catalog" aria-label="Найти в каталоге">Найти →</a></div></div>
          <div className="hero-points"><span>✓ Подбор специалистом</span><span>✓ Проверка перед отправкой</span><span>✓ Помощь с установкой</span></div>
        </div>
        <figure className="hero-visual">
          <img className="seal-blueprint-image" src="/assets/seal-blueprint-hero.webp" width="1000" height="750" alt="Технический чертёж поперечного профиля магнитного уплотнителя холодильника" loading="eager" />
          <figcaption className="visual-note"><span>Поперечный профиль</span><b>Магнитный ПВХ</b><small>техническая схема</small></figcaption>
        </figure>
      </div>
    </section>
    <section className="trust-strip"><div className="shell trust-grid"><a href="/catalog"><b>Все бренды</b><span>384 товарные позиции</span></a><a href="/selection"><b>Точный подбор</b><span>по фото и размерам</span></a><a href="/delivery"><b>Краснодар</b><span>отправка по России</span></a><a href="/instruction"><b>Консультация</b><span>инструкции по установке</span></a></div></section>
    <section className="catalog section shell" id="catalog">
      <div className="section-head"><div><p className="eyebrow"><span /> Каталог</p><h2>Популярные уплотнители</h2></div><p>Шаблоны карточек готовы для ваших фотографий, размеров, артикулов и актуальных цен.</p></div>
      <div className="brand-filter" aria-label="Фильтр по бренду">{brands.map((item) => <button key={item} className={brand === item ? "active" : ""} onClick={() => setBrand(item)}>{item}</button>)}</div>
      <div className="product-grid">{filtered.map((item) => <article className="product-card" key={item.id}><div className="product-image"><div className="photo-placeholder"><span className="mini-profile" /><small>место для фото товара</small></div><span className="product-code">{item.code}</span><button aria-label="Добавить в избранное">♡</button></div><div className="product-body"><p className="product-brand">{item.brand}</p><h3>Уплотнитель для холодильника {item.brand} {item.model}</h3><dl><div><dt>Размер</dt><dd>{item.size}</dd></div><div><dt>Крепление</dt><dd>{item.mount}</dd></div></dl><div className="product-buy"><b>{price(item.price)}</b><button onClick={() => addToCart(item.id)}>В заказ <span>+</span></button></div></div></article>)}</div>
      {filtered.length === 0 && <div className="empty-state"><b>Такой модели пока нет в каталоге</b><p>Отправьте данные холодильника — подберём совместимый уплотнитель вручную.</p><a href="#selection">Оставить заявку</a></div>}
      <div className="catalog-note"><span>Не нашли свою модель?</span><p>В каталоге показана только часть ассортимента. Подберём резинку для холодильника любого бренда.</p><a href="#selection">Подобрать по фото →</a></div>
    </section>
    <section className="selection section" id="selection"><div className="shell selection-grid">
      <div className="selection-copy"><p className="eyebrow light"><span /> Подбор без ошибки</p><h2>Не знаете модель?<br />Мы поможем</h2><p>Найдите шильдик внутри холодильника, сфотографируйте его и старый профиль сбоку. Специалист сверит данные перед оформлением.</p><ol><li><b>01</b><span><strong>Марка и модель</strong>С заводской наклейки холодильника</span></li><li><b>02</b><span><strong>Размер рамки</strong>Ширина и высота по внешнему краю</span></li><li><b>03</b><span><strong>Фото профиля</strong>Снимок торца резинки крупным планом</span></li></ol></div>
      <form className="selection-form" onSubmit={sendSelection}><span className="form-kicker">Бесплатный подбор</span><h3>Оставьте данные холодильника</h3><p>Откроется готовое письмо — при необходимости приложите к нему фотографии.</p><label>Ваше имя<input name="name" placeholder="Олег" required /></label><label>Номер телефона<input name="phone" type="tel" placeholder="+7 (___) ___-__-__" required /></label><label>Бренд и модель<input name="model" placeholder="Например, Atlant ХМ 4010" required /></label><button type="submit">Отправить на подбор <span>→</span></button><small>Нажимая кнопку, вы соглашаетесь на обработку персональных данных.</small></form>
    </div></section>
    <section className="steps section shell" id="delivery"><div className="section-head"><div><p className="eyebrow"><span /> Просто и понятно</p><h2>От модели до установки</h2></div></div><div className="step-grid"><article><i>01</i><h3>Подбираем</h3><p>Проверяем модель, размеры и тип крепления уплотнителя.</p></article><article><i>02</i><h3>Комплектуем</h3><p>Сверяем рамку перед отправкой и надёжно упаковываем.</p></article><article><i>03</i><h3>Доставляем</h3><p>По Краснодару или транспортной службой в ваш город.</p></article><article><i>04</i><h3>Помогаем</h3><p>Даём инструкцию и отвечаем на вопросы по установке.</p></article></div></section>
    <section className="seo-section section"><div className="shell seo-grid"><div><p className="eyebrow"><span /> Уплотнитель23</p><h2>Резинки для холодильников всех брендов</h2></div><div><p>Изношенный уплотнитель для холодильника пропускает тёплый воздух: компрессор работает дольше, внутри появляется наледь, а продукты хранятся хуже. Новая магнитная резинка помогает двери снова прилегать равномерно по всему периметру.</p><p>Подбираем дверные уплотнители для холодильников Atlant, Bosch, Indesit, LG, Samsung, Stinol, Бирюса, Liebherr и других производителей. Если готовой позиции нет в каталоге, проверим возможность изготовления рамки нужного размера.</p><div className="seo-links">{brands.slice(1).map((item) => <a key={item} href={`/uplotniteli/${brandSlugs[item]}`}>Уплотнитель для {item}</a>)}</div></div></div></section>
    <section className="faq section shell"><div className="section-head"><div><p className="eyebrow"><span /> Ответы специалиста</p><h2>Частые вопросы</h2></div></div><div className="faq-list">{faqs.map(([q, a], index) => <details key={q} open={index === 0}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section>
    <SiteFooter />
    {notice && <div className="toast" role="status">✓ {notice}</div>}
  </main>;
}
