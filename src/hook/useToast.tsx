"use client";

import { Id, toast, ToastOptions, UpdateOptions } from "react-toastify";
import { toastConfig, toastUpdateConfig } from "@/config/toastConfig";

import CircularProgress from "@mui/material/CircularProgress";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function useToast() {
  let toastId: Id | null;

  /**
   * @description Notify when request processing
   * @param mss - string: message
   * @returns void
   */
  const notify = (mss: string = "Request processing...", params?: ToastOptions) =>
    (toastId = toast(
      mss,
      toastConfig({
        icon: (
          <div className="flex justify-center items-center">
            <CircularProgress size="16px" />
          </div>
        ),
        autoClose: false,
        ...params,
      })
    ));

  /**
   * @description Update toast
   * @param success - boolean: success or error
   * @param mess - string: message
   * @param params - object: update options
   * @returns void
   */
  const update = (success: boolean = true, mess?: string, params?: UpdateOptions) => {
    if (!toastId) return;
    toast.update(
      toastId,
      toastUpdateConfig({
        render: mess ?? "Success",
        icon: (
          <div>
            {success ? (
              <CheckCircleOutlineIcon sx={{ color: "#3eb049", fontSize: "24px" }} />
            ) : (
              <ErrorOutlineIcon sx={{ color: "#F37482", fontSize: "24px" }} />
            )}
          </div>
        ),
        autoClose: 2000,
        style: {
          color: success ? "#3eb049" : "#F37482",
          ...params?.style,
        },
        ...params,
      })
    );
  };

  const _toast = (mss: string, params?: ToastOptions) =>
    toast(
      mss,
      toastConfig({
        icon: (
          <div>
            <CheckCircleOutlineIcon sx={{ color: "#3eb049", fontSize: "24px" }} />
          </div>
        ),
        ...params,
      })
    );

  return { notify, update, _toast };
}
