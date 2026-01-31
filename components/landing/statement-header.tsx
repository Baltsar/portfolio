type StatementHeaderProps = {
  name: string;
};

/** Renders full name with middle name "BALTSAR" in serif for SEO. */
export function StatementHeader({ name }: StatementHeaderProps) {
  const parts = name.split(" ");
  const middleIndex = parts.findIndex((p) => p === "BALTSAR");
  const hasMiddle = middleIndex >= 0;

  return (
    <header className="border-b border-[var(--border-glass)] py-3 sm:py-4">
      <p className="font-statement text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-primary)] sm:text-sm">
        {hasMiddle ? (
          <>
            {parts.slice(0, middleIndex).join(" ")}{" "}
            <span className="font-serif">{parts[middleIndex]}</span>
            {parts.slice(middleIndex + 1).length ? ` ${parts.slice(middleIndex + 1).join(" ")}` : ""}
          </>
        ) : (
          name
        )}
      </p>
    </header>
  );
}
