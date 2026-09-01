import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "../../admin-auth";
import { PageHero, SiteFooter, SiteHeader } from "../../components/site-shell";
import AdminAuthForm from "../auth-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Регистрация владельца", robots: { index: false, follow: false } };
export default async function AdminRegisterPage() {
  if (await getAdminSession()) redirect("/admin");
  return <main><SiteHeader/><PageHero eyebrow="Первичная настройка" title="Регистрация владельца" lead="Создать администратора можно только один раз и только с секретным ключом активации. После регистрации эта форма больше не выдаст доступ."/><section className="section shell owner-auth-wrap"><AdminAuthForm mode="register"/><aside className="owner-security-note"><b>Защита доступа</b><p>Пароль хранится только в виде стойкого хэша. После пяти неверных попыток вход временно блокируется.</p></aside></section><SiteFooter/></main>;
}
