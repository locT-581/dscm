import { ToastOptions, UpdateOptions } from "react-toastify";

export function toastConfig(params?: ToastOptions): ToastOptions {
  return {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    closeButton: true,

    style: {
      // fontSize: "17px",
      // fontWeight: 700,
      padding: "0px 12px",
      // margin: "8px auto",
      // color: "#FFF",
      // backgroundColor: "#0D0D0D",
      // borderRadius: "16px",
      // border: "1.5px solid rgba(255, 255, 255, 0.11)",
      // minHeight: "32px",
      // width: "95%",
      // boxShadow: "0px 2px 16px 0px rgba(0, 0, 0, 0.20)",
      ...params?.style,
    },
    ...params,
  };
}

export function toastUpdateConfig(params?: UpdateOptions): UpdateOptions {
  return {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    closeButton: true,
    style: {
      // fontSize: "17px",
      // fontWeight: 700,
      padding: "0px 12px",
      // margin: "8px auto",
      // color: "#FFF",
      // backgroundColor: "#0D0D0D",
      // borderRadius: "16px",
      // border: "1.5px solid rgba(255, 255, 255, 0.11)",
      // minHeight: "32px",
      // width: "95%",
      // boxShadow: "0px 2px 16px 0px rgba(0, 0, 0, 0.20)",
      ...params?.style,
    },
    ...params,
  };
}
