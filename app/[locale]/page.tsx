import { Hero } from "@/components/landing/hero";
import { StatementHeader } from "@/components/landing/statement-header";
import { Stack } from "@/components/landing/stack";
import { ProjectCard } from "@/components/live-project/project-card";
import { ProjectCardFork } from "@/components/live-project/project-card-fork";
import { Footer } from "@/components/landing/footer";
import { MoreProjectsSection } from "@/components/landing/more-projects-section";
import { ClarificationStatement } from "@/components/landing/clarification-statement";
import { ProjectStrip } from "@/components/landing/project-strip";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  const messages = getMessages(locale as Locale);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-5 sm:py-8 md:px-6 md:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <StatementHeader name={messages.statement.name} />
          <LanguageSwitcher />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 md:gap-10">
          <section
            id="statement"
            className="card-glass p-6 sm:p-7 md:p-8"
            aria-label={messages.sections.statement}
          >
            <Hero lines={messages.hero.lines} />
            <div className="mt-6">
              <Stack
                tech={messages.stack.tech}
                attributes={messages.stack.attributes}
              />
            </div>
          </section>
          <section
            id="feature"
            className="group flex flex-col gap-6"
            aria-label={messages.sections.feature}
          >
            <ProjectCard project={messages.projects[0]} messages={messages} />
            <ProjectCardFork project={messages.projects[1]} messages={messages} />
          </section>
        </div>

        <MoreProjectsSection messages={messages} />

        <ClarificationStatement messages={messages} />

        <ProjectStrip messages={messages} />
        <Footer messages={messages} />
      </div>
    </main>
  );
}
