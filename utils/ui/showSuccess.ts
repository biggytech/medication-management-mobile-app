import { AppColors } from "@/constants/styling/colors";

const { Toast } = require("toastify-react-native");

export const showSuccess = (message: string, details?: string) => {
  Toast.show({
    type: "custom",
    text1: message,
    text2: details,
    backgroundColor: AppColors.POSITIVE,
    textColor: AppColors.WHITE,
    iconColor: AppColors.WHITE,
    icon: "checkmark-circle",
    visibilityTime: 1000,
  });
};
