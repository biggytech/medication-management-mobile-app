import { StyleSheet } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { Fonts, FontSizes } from "@/constants/styling/fonts";

export const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    width: 200,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: AppColors.SECONDARY,
    padding: 10,
    fontSize: FontSizes.STANDART,
    color: AppColors.FONT,
    fontFamily: Fonts.DEFAULT,
    backgroundColor: AppColors.WHITE,
  },
  focused: {
    borderColor: AppColors.ACCENT,
  },
  errored: {
    borderColor: AppColors.NEGATIVE,
  },
});
