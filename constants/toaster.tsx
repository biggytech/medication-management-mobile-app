import { Toaster, type ToasterProps } from "@/components/Toaster";

const TOAST_MANAGER_CONFIG = {
  custom: (props: ToasterProps) => <Toaster {...props} />,
};

export const TOAST_MANAGER_OPTIONS = {
  showProgressBar: false,
  position: "top",
  theme: "light",
  duration: 2000,
  showCloseIcon: false,
  topOffset: 10,
  config: TOAST_MANAGER_CONFIG,
};
