import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { ExperimentContent } from "./experiment-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

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
