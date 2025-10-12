import { StyleSheet } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";
import { FontSizes } from "@/constants/styling/fonts";

export const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacings.SMALL,
    paddingHorizontal: Spacings.STANDART,
    backgroundColor: AppColors.WHITE,
    borderRadius: 5,
    marginBottom: Spacings.SMALL,
    shadowColor: AppColors.DARKGREY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  left: {
    marginRight: Spacings.STANDART,
  },
  title: {
    fontSize: FontSizes.STANDART,
    fontWeight: "600",
    marginBottom: 4,
  },
  subTitle: {
    fontSize: FontSizes.SMALL,
    color: AppColors.DARKGREY,
  },
  overdue: {
    color: AppColors.NEGATIVE,
    fontWeight: "600",
  },
  right: {
    marginLeft: "auto",
  },
});
