import { StyleSheet } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";
import { FontSizes } from "@/constants/styling/fonts";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  control: {
    width: "100%",
    paddingVertical: Spacings.STANDART / 2,
    paddingHorizontal: Spacings.STANDART,
    borderRadius: 8,
    backgroundColor: AppColors.WHITE,
    borderWidth: 1,
    borderColor: AppColors.GREY,
  },
  controlText: {
    color: AppColors.FONT,
    fontSize: FontSizes.STANDART,
  },
  actions: {
    flexDirection: "row",
    columnGap: Spacings.SMALL,
    marginTop: Spacings.SMALL,
    alignItems: "center",
    justifyContent: "space-between",
  },
  action: {
    flex: 1,
  },
});
