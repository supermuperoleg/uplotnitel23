import type { Metadata } from "next";
import { PageHero, SiteFooter, SiteHeader } from "../components/site-shell";
import CartClient from "./cart-client";

export const metadata: Metadata = { title: "Корзина", description: "Товары, выбранные в каталоге Уплотнитель23." };

export default function Page() {
  return <main>
    <SiteHeader />
    <PageHero eyebrow="Корзина" title="Ваш заказ" lead="Проверьте выбранные товары и отправьте заявку магазину." />
    <CartClient />
    <SiteFooter />
  </main>;
}
