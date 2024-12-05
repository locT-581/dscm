import { format } from "date-fns";
export default function formatDate(
  dateString: string,
  showHour = true,
  type?: "dd-mm" | "dd-mm-yy" | "dd-short-yy" | "hh-mm" | "mm-dd" | "mm-dd-hh-mm"
) {
  try {
    const timestamp = Date.parse(dateString);
    const date = new Date(timestamp);
    if (type === "dd-mm") {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
    }
    if (type === "mm-dd") {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });
    }
    if (type === "hh-mm") {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
    if (type === "mm-dd-hh-mm") {
      return date.toLocaleTimeString("en-US", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
    if (type === "dd-mm-yy") {
      return date.toLocaleDateString("vi-VN", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      });
    }
    if (type === "dd-short-yy") {
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    }
    if (showHour) {
      // const dateString = date.toLocaleDateString("en-US", {
      //   year: "numeric",
      //   month: "short",
      //   day: "numeric",
      //   hour: "numeric",
      //   minute: "numeric",
      //   second: "numeric",
      //   hourCycle: "h23",
      // });
      const dateString = format(date, "MMM dd, yyyy '-' HH:mm:ss");
      return dateString;
      //   .split(",");
      // return dateString[0] + "," + dateString[1] + " -" + dateString[2];
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  } catch (err) {
    console.error(err);
    return "Loading...";
  }
}

export function isValidDate(dateString: string) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}
