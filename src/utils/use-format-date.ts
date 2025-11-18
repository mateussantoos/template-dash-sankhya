import dayjs from "dayjs";
import "dayjs/locale/pt-br";

/**
 * Formats a date to the Brazilian pattern: DD/MM/YYYY HH:mm.
 *
 * Accepts:
 *  - string (ISO, "YYYY-MM-DD", etc)
 *  - number (timestamp in milliseconds)
 *  - Date instance
 *
 * @param {string | number | Date} date - The date to format.
 * @returns {string} The formatted date string in the pattern DD/MM/YYYY HH:mm.
 */
export const formatDate = (date: string | number | Date) => {
  // dayjs handles string, number, and Date types by default.
  // Sets the locale to pt-br and formats the date.
  return dayjs(date).locale("pt-br").format("DD/MM/YYYY HH:mm");
};
