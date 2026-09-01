import type { ReactNode } from "react";
import CartButton from "./cart-button";

export function SealLogo({ light = false }: { light?: boolean }) {
  return <span className={`brand-logo ${light ? "brand-logo-light" : ""}`}><span className="product-profile-logo" aria-hidden="true" style={{position:"relative",display:"block",width:48,height:48,border:`5px solid ${light ? "#64b5f5" : "#006be6"}`,borderRadius:10,flex:"0 0 auto"}}><i style={{position:"absolute",display:"block",right:-12,top:9,width:14,height:26,border:"4px solid #ff7a1a",borderRadius:6,background:light ? "#071c26" : "#fff"}}/></span><span><b>Уплотнитель</b><em>23</em><small>для холодильников</small></span></span>;
}

export function SiteHeader({ actions }: { actions?: ReactNode }) {
  return <header className="site-header"><div className="announcement">Подбор по модели и фото · Отправка по России</div><div className="nav shell"><a className="logo" href="/" aria-label="Уплотнитель23 — главная"><SealLogo/></a><nav aria-label="Основная навигация"><a href="/catalog">Каталог</a><a href="/selection">Как подобрать</a><a href="/delivery">Доставка</a><a href="/instruction">Инструкция</a><a href="/cooperation">Сотрудничество</a><a href="/contacts">Контакты</a></nav><div className="header-actions"><a className="account-link login-link" href="/account#login">Вход</a><a className="account-link register-link" href="/account#register" style={{background:"#006be6",borderColor:"#006be6",color:"#fff"}}>Регистрация</a>{actions}<CartButton/></div></div><nav className="mobile-nav" aria-label="Мобильная навигация"><div className="shell"><a href="/catalog">Каталог</a><a href="/selection">Как подобрать</a><a href="/delivery">Доставка</a><a href="/instruction">Инструкция</a><a href="/cooperation">Сотрудничество</a><a href="/contacts">Контакты</a></div></nav></header>;
}

export function SiteFooter() {
  return <footer><div className="shell footer-grid"><div><a className="logo footer-logo" href="/"><SealLogo light/></a><p>Подбор и продажа магнитных уплотнителей для бытового и коммерческого холодильного оборудования.</p></div><div><h3>Покупателям</h3><a href="/catalog">Каталог</a><a href="/selection">Подбор по модели</a><a href="/delivery">Доставка и оплата</a><a href="/instruction">Инструкции</a><a href="/account">Личный кабинет</a></div><div><h3>Контакты</h3><a className="footer-phone" href="tel:+79180524625">8 918 052-46-25</a><a href="mailto:zapthasti2019@mail.ru">zapthasti2019@mail.ru</a><address>Краснодар, ул. Знаменская, 93/1</address></div></div><div className="shell legal"><span>© 2026 Уплотнитель23</span><span>ИП Сорокин Олег Александрович · ИНН 234909522126 · ОГРНИП 319237500342941</span><a href="/privacy">Политика конфиденциальности</a></div></footer>;
}

export function PageHero({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return <section className="page-hero"><div className="shell"><div className="breadcrumbs"><a href="/">Главная</a><span>→</span><b>{eyebrow}</b></div><p className="eyebrow"><span/> {eyebrow}</p><h1>{title}</h1><p>{lead}</p></div></section>;
}
