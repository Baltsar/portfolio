import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = getMessages(locale as Locale);
  return {
    title: messages.meta.title,
    description: messages.meta.description,
  };
}

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
