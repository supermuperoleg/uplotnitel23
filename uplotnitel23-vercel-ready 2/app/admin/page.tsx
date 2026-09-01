import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "../admin-auth";
import { getManagedProducts } from "../data/managed-products";
import { PageHero, SiteFooter, SiteHeader } from "../components/site-shell";
import AdminClient from "./admin-client";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Управление товарами", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");
  const products = await getManagedProducts();
  return <main><SiteHeader/><PageHero eyebrow="Админ-панель" title="Управление каталогом" lead="Добавляйте карточки вручную. Новые бренды, категории и размеры автоматически появятся в фильтрах каталога."/><AdminClient initialProducts={products} username={admin.username}/><SiteFooter/></main>;
}
