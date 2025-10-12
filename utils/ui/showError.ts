import { AppColors } from "@/constants/styling/colors";

const { Toast } = require("toastify-react-native");

export const showError = (message: string, details?: string) => {
  Toast.show({
    type: "custom",
    text1: message,
    text2: details,
    backgroundColor: AppColors.NEGATIVE,
    textColor: AppColors.WHITE,
    iconColor: AppColors.WHITE,
    icon: "alert-circle",
  });
};
