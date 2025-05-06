import { StyleSheet } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";

export const BASIC_STYLES = StyleSheet.create({
  screen: {
    backgroundColor: AppColors.BACKGROUND,
    padding: Spacings.STANDART,
    flex: 1,
  },
});
