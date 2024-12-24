import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, locales } from "@/lib/locales";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !locales.includes(locale as string)) {
    locale = DEFAULT_LOCALE;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
