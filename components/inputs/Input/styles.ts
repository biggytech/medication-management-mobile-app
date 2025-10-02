import { StyleSheet } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { Fonts, FontSizes } from "@/constants/styling/fonts";
import { Spacings } from "@/constants/styling/spacings";

export const styles = StyleSheet.create({
  container: {
    marginBottom: Spacings.SMALL,
    width: 200,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: AppColors.SECONDARY,
    padding: Spacings.SMALL,
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
