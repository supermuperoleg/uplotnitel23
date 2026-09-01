import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "../../admin-auth";
import { PageHero, SiteFooter, SiteHeader } from "../../components/site-shell";
import AdminAuthForm from "../auth-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Вход владельца", robots: { index: false, follow: false } };
export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");
  return <main><SiteHeader/><PageHero eyebrow="Защищённый вход" title="Вход владельца сайта" lead="Введите отдельный логин и пароль администратора. Обычный пользовательский аккаунт не даёт доступа к управлению."/><section className="section shell owner-auth-wrap"><AdminAuthForm mode="login"/><p className="owner-auth-link">Первый вход владельца? <a href="/admin/register">Активировать админ‑аккаунт</a></p></section><SiteFooter/></main>;
}
