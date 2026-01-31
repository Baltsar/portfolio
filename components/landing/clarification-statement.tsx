import type { Messages } from "@/lib/i18n";

type ClarificationStatementProps = {
  messages: Messages;
};

export function ClarificationStatement({ messages }: ClarificationStatementProps) {
  const { heading, body } = messages.clarificationStatement;
  return (
    <section
      id="clarification"
      className="mt-10 border-t border-[var(--border-glass)] pt-8 text-center"
      aria-label={heading}
    >
      <h2 className="font-statement text-2xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-3xl md:text-4xl">
        {heading}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]/90 sm:text-base">
        {body}
      </p>
    </section>
  );
}
