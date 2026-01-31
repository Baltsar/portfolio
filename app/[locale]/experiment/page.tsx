import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { ExperimentContent } from "./experiment-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: { canonical: `/${locale}/experiment` },
    openGraph: { url: `/${locale}/experiment` },
    twitter: {},
  };
}

export default async function ExperimentPage({ params }: PageProps) {
  const { locale } = await params;
  const messages = getMessages(locale as Locale);

  return (
    <ExperimentContent
      backHref={`/${locale}`}
      backLabel={messages.workbench.back}
      experimentLabel={messages.workbench.experimentLabel}
      hint={messages.workbench.hint}
    />
  );
}
