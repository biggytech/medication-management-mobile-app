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
  taken: {},
  title: {},
  subTitle: {
    color: AppColors.DARKGREY,
  },
  takenText: {
    color: AppColors.POSITIVE,
  },
  left: {
    marginRight: Spacings.STANDART,
  },
  right: {
    marginLeft: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
});
