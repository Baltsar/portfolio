import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Lora, Roboto_Mono } from "next/font/google";
import { HtmlLangSwitcher } from "@/components/shared/html-lang";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-statement",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL != null
    ? process.env.NEXT_PUBLIC_SITE_URL
    : process.env.VERCEL_URL != null
      ? `https://${process.env.VERCEL_URL}`
      : null;

export const metadata: Metadata = {
  metadataBase: baseUrl != null ? new URL(baseUrl) : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1f2121",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={`${inter.variable} ${jetbrainsMono.variable} ${robotoMono.variable} ${lora.variable}`}>
      <head>
        {process.env.NEXT_PUBLIC_FB_APP_ID != null && (
          <meta property="fb:app_id" content={process.env.NEXT_PUBLIC_FB_APP_ID} />
        )}
      </head>
      <body className="min-h-screen font-sans antialiased">
        <HtmlLangSwitcher />
        {children}
      </body>
    </html>
  );
}
