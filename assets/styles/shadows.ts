import { StyleSheet } from "react-native";
import { AppColors } from "@/constants/styling/colors";

export const boxShadowStyles = StyleSheet.create({
  standart: {
    boxShadow: `0px 3px 5px ${AppColors.GREY}`,
  },
});
