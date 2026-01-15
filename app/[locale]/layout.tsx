import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "../globals.css"; 
import AppWalletProvider from "../components/AppWalletProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://wavis.xyz'),
  title: "WAVIS - Recovery Center",
  description: "Don't Lose Blindly. Recover your rent from unused Solana accounts.",
  icons: {
    icon: '/favicon.png', // publicフォルダ、またはapp直下の自動生成パス
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
  title: "WAVIS - Recover Your Rent",
  description: "Scan your wallet and burn spam tokens to get SOL back instantly.",
  url: "https://wavis.xyz", // 本番URL（後で決まったら書き換えます）
  siteName: "WAVIS",
  images: [
    {
      url: "/og-image.png", // publicフォルダに入れた画像
      width: 1200,
      height: 630,
    },
  ],
  locale: "en_US",
  type: "website",
},
twitter: {
  card: "summary_large_image", // 大きな画像を表示する設定
  title: "WAVIS - Recover Your Rent",
  description: "Clean your wallet & Earn SOL.",
  images: ["/og-image.png"], // Twitter用にも同じ画像を指定
},
};

// 👇 ここが重要！ params の型を Promise に変更しています
export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; 
}) {
  // 👇 ここで await して中身を取り出します
  const { locale } = await params;

  // 翻訳メッセージを取得
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <AppWalletProvider>
            {children}
          </AppWalletProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}