import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "../../components/site-shell";

const brands: Record<string, { name: string; examples: string[] }> = {
  atlant:{name:"Atlant",examples:["ХМ 4008 / 4010","МХМ 1704 / 1716"]}, bosch:{name:"Bosch",examples:["KGV серия","KGN серия"]},
  indesit:{name:"Indesit",examples:["C 132 / C 138","BIA серия"]}, lg:{name:"LG",examples:["GA-B409","GA-B419"]},
  samsung:{name:"Samsung",examples:["RL33","RL34"]}, stinol:{name:"Stinol",examples:["101 / 103","107 / 110"]},
  biryusa:{name:"Бирюса",examples:["6 / 10","14 / 18"]}, liebherr:{name:"Liebherr",examples:["Comfort серия","Premium серия"]},
};
export function generateStaticParams(){return Object.keys(brands).map(brand=>({brand}));}
export async function generateMetadata({params}:{params:Promise<{brand:string}>}):Promise<Metadata>{const {brand}=await params;const d=brands[brand];return d?{title:`Уплотнитель для холодильника ${d.name} — купить резинку`,description:`Подбор и продажа уплотнителей для холодильников ${d.name}. Найдём резинку по модели, размеру или фотографии. Краснодар, доставка по России.`}:{};}

export default async function BrandPage({params}:{params:Promise<{brand:string}>}){
  const {brand}=await params;const data=brands[brand];if(!data)notFound();
  return <main>
    <SiteHeader />
    <section className="brand-hero"><div className="shell"><div className="breadcrumbs"><a href="/">Главная</a><span>→</span><a href="/#catalog">Каталог</a><span>→</span><b>{data.name}</b></div><p className="eyebrow"><span/> Каталог по бренду</p><h1>Уплотнитель для<br/>холодильника <strong>{data.name}</strong></h1><p>Подберём дверную резинку для холодильника {data.name} по точной модели, размерам рамки или фотографии профиля.</p><a className="primary-link" href="/#selection">Подобрать уплотнитель →</a></div></section>
    <section className="section shell"><div className="section-head"><div><p className="eyebrow"><span/> Популярные серии</p><h2>Уплотнители {data.name}</h2></div><p>Карточки готовы к наполнению фотографиями, артикулами, размерами и актуальными ценами.</p></div><div className="product-grid">{data.examples.map((model,index)=><article className="product-card" key={model}><div className="product-image"><div className="photo-placeholder"><span className="mini-profile"/><small>место для фото товара</small></div><span className="product-code">{data.name.slice(0,3).toUpperCase()}-{String(index+1).padStart(2,"0")}</span></div><div className="product-body"><p className="product-brand">{data.name}</p><h3>Уплотнитель для холодильника {data.name} {model}</h3><dl><div><dt>Размер</dt><dd>уточняется по модели</dd></div><div><dt>Крепление</dt><dd>по профилю</dd></div></dl><div className="product-buy"><b>Цена по запросу</b><a href="/#selection">Подобрать</a></div></div></article>)}</div></section>
    <section className="brand-copy section"><div className="shell seo-grid"><div><p className="eyebrow"><span/> Точный подбор</p><h2>Как выбрать резинку для {data.name}</h2></div><div><p>У одной модели холодильника могут использоваться разные типы профиля и крепления. Поэтому перед заказом важно сверить полную маркировку с заводского шильдика, расположенного внутри камеры или на боковой стенке.</p><p>Если номер модели не читается, измерьте ширину и высоту старой рамки по внешнему краю и сфотографируйте профиль сбоку. Мы сопоставим форму, посадочное место и размеры, чтобы предложить подходящий вариант.</p></div></div></section>
    <section className="brand-cta"><div className="shell"><div><span>Нужна помощь с моделью?</span><h2>Пришлите фото — проверим профиль</h2></div><a href="mailto:zapthasti2019@mail.ru?subject=Подбор%20уплотнителя">Написать специалисту →</a></div></section>
    <SiteFooter />
  </main>;
}
