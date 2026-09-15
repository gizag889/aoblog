import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { siteMetadata } from "@/constants/site-metadata";




 
const notoSansJP = Noto_Sans_JP({
  // Google FontsのURLで指定していたウェイトを配列で指定
  weight: ['300', '400', '700'],
  // 必要なサブセットを指定。日本語の場合は'japanese'を含める
  subsets: ['latin'],
  // CSS変数として使用する場合はvariableプロパティを追加
  variable: '--font-noto-sans-jp', 
  display: 'swap', // フォントの読み込み戦略を指定
});
 
export const metadata: Metadata = {
  // metadataBase: new URL(siteMetadata.SITE_URL),
  title: {
    default: siteMetadata.SITE_NAME,
    template: `%s | ${siteMetadata.SITE_NAME}`,
  },
  description: siteMetadata.SITE_DESC,
   verification: {
    google: "cFEYuB4wyabaH14lOG0b9IbT3JE-VmYrWr_3cBYsNCQ",
  },
  openGraph: {
    title: siteMetadata.SITE_NAME,
    description: siteMetadata.SITE_DESC,
    siteName: siteMetadata.SITE_NAME,
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.SITE_NAME,
    description: siteMetadata.SITE_DESC,
  },
};
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={notoSansJP.className}
      >
        {children}
      </body>
    </html>
  );
}