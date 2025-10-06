import { StyleSheet } from "react-native";
import { AppColors } from "@/constants/styling/colors";

export const boxShadowStyles = StyleSheet.create({
  small: {
    boxShadow: `0px 1px 3px ${AppColors.GREY}`,
  },
  standart: {
    boxShadow: `0px 3px 5px ${AppColors.GREY}`,
  },
});
