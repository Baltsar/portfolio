import type { Metadata } from "next";
import { getMessages, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = getMessages(locale as Locale);
  const { title, description, ogTitle, ogDescription, keywords } = messages.meta;
  return {
    title,
    description,
    keywords: keywords?.split(", ").map((k) => k.trim()) ?? undefined,
    openGraph: {
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      type: "website",
      images: [{ url: "/images/DigitalDesigner_GustafGarnow.png", width: 1200, height: 630, alt: ogTitle ?? title }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      images: ["/images/DigitalDesigner_GustafGarnow.png"],
    },
  };
}

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
