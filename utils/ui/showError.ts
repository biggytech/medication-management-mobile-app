import { Toast } from "toastify-react-native";
import { AppColors } from "@/constants/styling/colors";

export const showError = (message: string, details?: string) => {
  Toast.show({
    // @ts-expect-error - Toast doesn't recognize custom type
    type: "custom",
    text1: message,
    text2: details,
    backgroundColor: AppColors.NEGATIVE,
    textColor: AppColors.WHITE,
    iconColor: AppColors.WHITE,
    icon: "alert-circle",
  });
};
