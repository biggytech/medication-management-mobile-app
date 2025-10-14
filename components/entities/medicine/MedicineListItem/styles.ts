import { StyleSheet } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";

export const styles = StyleSheet.create({
  item: {
    paddingHorizontal: Spacings.STANDART,
    paddingVertical: Spacings.SMALL,
    width: "100%",
    flexDirection: "row",
    borderBottomColor: AppColors.GREY,
    borderBottomWidth: 1,
  },
  title: {},
  subTitle: {
    color: AppColors.DARKGREY,
  },
  left: {
    marginRight: Spacings.STANDART,
  },
  right: {
    marginLeft: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  overdue: {
    color: AppColors.NEGATIVE,
  },
  lowCount: {
    color: AppColors.NEGATIVE,
    fontWeight: "bold",
  },
  warn: {
    color: AppColors.NEGATIVE,
  },
});
