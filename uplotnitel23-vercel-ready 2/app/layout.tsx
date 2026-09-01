import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Уплотнитель23 — уплотнители для холодильников", template: "%s | Уплотнитель23" },
  description: "Купить уплотнитель для холодильника в Краснодаре с доставкой по России. Подбор резинки по бренду, модели, размеру и фото. Все популярные марки.",
  keywords: ["уплотнитель для холодильника", "резинка для холодильника", "купить уплотнитель холодильника", "уплотнитель двери холодильника", "Краснодар"],
  robots: { index: true, follow: true },
  openGraph: { title: "Уплотнитель23 — резинки для холодильников", description: "Подберём уплотнитель по модели, размеру или фотографии", locale: "ru_RU", type: "website" },
  other: { "codex-preview": "development" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ru"><body>{children}</body></html>; }
