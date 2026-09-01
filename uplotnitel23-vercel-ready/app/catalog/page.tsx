import type { Metadata } from "next";
import { PageHero, SiteFooter, SiteHeader } from "../components/site-shell";
import { getManagedProducts } from "../data/managed-products";
import CatalogClient from "./catalog-client";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Каталог уплотнителей для холодильников", description: "Каталог из 384 позиций с артикулами. Поиск уплотнителя по названию, модели, размеру и артикулу." };
export default async function CatalogPage(){const managedProducts=await getManagedProducts();return <main><SiteHeader/><PageHero eyebrow="Каталог" title="Все уплотнители и комплектующие" lead="Используйте поиск по модели холодильника, размеру, производителю или номеру товара."/><CatalogClient managedProducts={managedProducts}/><SiteFooter/></main>}
