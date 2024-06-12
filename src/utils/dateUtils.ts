import { format } from "date-fns";
import i18n from "../i18n/i18n";
import { locales } from "../i18n/i18n";

const getLocale = (lng: string) => {
  switch (lng) {
    case "es":
      return locales.es;
    case "en":
    default:
      return locales.en;
  }
};

export const formatDate = (dateString: string): string => {
  const locale = getLocale(i18n.language);
  const date = new Date(dateString);
  return format(date, "EEEE dd 'de' MMMM 'de' yyyy 'a las' HH:mm:ss'h'", {
    locale,
  });
};

export const formatDateToDDMMYYYY = (dateString: string): string => {
  const locale = getLocale(i18n.language);
  const date = new Date(dateString);
  return format(date, "dd-MM-yyyy HH:mm:ss", { locale });
};
