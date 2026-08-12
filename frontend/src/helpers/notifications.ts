import { toast, type ToastOptions } from "react-toastify";

const baseOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
};

export function notifySuccess(message: string) {
  toast.success(message, baseOptions);
}

export function notifyError(message: string) {
  toast.error(message, baseOptions);
}
