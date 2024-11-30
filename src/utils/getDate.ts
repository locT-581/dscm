/**
 * Returns the current date and time in the format "dd-mm-yyyy hh:mm:ss"
 * @returns {string} - Returns the current date and time in the format "dd-mm-yyyy hh:mm:ss"
 */
export default function getDate(initialDate?: string | number): string {
  const today = initialDate ? new Date(initialDate) : new Date();
  const d = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
  const t =
    (today.getHours() < 10 ? "0" + today.getHours() : today.getHours()) +
    ":" +
    (today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes()) +
    ":" +
    (today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds());
  const date = d + " " + t;

  return date;
}
