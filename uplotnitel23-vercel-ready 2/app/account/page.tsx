import type { Metadata } from "next";
import { getCustomerSession } from "../customer-auth";
import { PageHero, SiteFooter, SiteHeader } from "../components/site-shell";
import CustomerAuthForms from "./customer-auth-forms";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Личный кабинет",
  description: "Вход и регистрация покупателя магазина Уплотнитель23 по электронной почте.",
};

export default async function Page() {
  let user: { email: string } | null = null;
  try {
    user = await getCustomerSession();
  } catch {
    user = null;
  }

  return <main>
    <SiteHeader />
    <PageHero
      eyebrow="Личный кабинет"
      title={user ? "Личный кабинет" : "Вход и регистрация"}
      lead={user ? `Вы вошли как ${user.email}.` : "Создайте аккаунт по электронной почте или войдите с ранее указанными данными."}
    />
    <section className="section shell account-wrap">
      {user ? <div className="account-card">
        <span className="account-avatar">{user.email.slice(0, 1).toUpperCase()}</span>
        <div>
          <p>Вы вошли как</p>
          <h2>{user.email}</h2>
          <a href={`mailto:zapthasti2019@mail.ru?subject=${encodeURIComponent("Запрос из личного кабинета")}`}>Написать по заказу →</a>
          <form action="/api/customer/logout" method="post" className="account-logout-form"><button type="submit">Выйти</button></form>
        </div>
      </div> : <CustomerAuthForms />}
    </section>
    <SiteFooter />
  </main>;
}
