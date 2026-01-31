import sv from "@/messages/sv.json";
import en from "@/messages/en.json";

export type Locale = "sv" | "en";

export const defaultLocale: Locale = "sv";

export const locales: Locale[] = ["sv", "en"];

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export type Messages = typeof sv;

const messagesMap: Record<Locale, Messages> = { sv, en };

export function getMessages(locale: Locale): Messages {
  return messagesMap[locale] ?? messagesMap.sv;
}
