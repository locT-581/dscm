/**
 * Returns the current date and time in the format "dd-mm-yyyy hh:mm:ss"
 * @returns {string} - Returns the current date and time in the format "dd-mm-yyyy hh:mm:ss"
 */
export default function getDate() {
    const today = new Date();
    const d = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
    const t = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const date = d + " " + t;

    return date;
}
