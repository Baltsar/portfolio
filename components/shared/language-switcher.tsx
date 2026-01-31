"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Locale, locales } from "@/lib/i18n";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const pathWithoutLocale = pathname ? pathname.replace(/^\/(sv|en)/, "") || "/" : "/";

  return (
    <nav aria-label="Språk" className="flex items-center gap-1">
      {locales.map((locale) => {
        const isCurrent = pathname != null && pathname.startsWith("/" + locale);
        return (
          <Link
            key={locale}
            href={"/" + locale + pathWithoutLocale}
            className="rounded px-2 py-1 text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent-blue)]"
            aria-current={isCurrent ? "page" : undefined}
          >
            {locale === "sv" ? "SV" : "EN"}
          </Link>
        );
      })}
    </nav>
  );
}
