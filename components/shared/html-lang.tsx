"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { isValidLocale } from "@/lib/i18n";

export function HtmlLangSwitcher() {
  const pathname = usePathname();

  useEffect(() => {
    const segment = pathname?.split("/")[1];
    const lang = segment && isValidLocale(segment) ? segment : "sv";
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [pathname]);

  return null;
}
