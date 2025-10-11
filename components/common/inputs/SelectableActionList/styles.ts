import { StyleSheet } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";
import { FontSizes } from "@/constants/styling/fonts";

export const styles = StyleSheet.create({
  header: {
    padding: Spacings.SMALL / 2,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.GREY,
  },
  headerText: {
    color: AppColors.DARKGREY,
    fontStyle: "italic",
    textAlign: "center",
    fontSize: FontSizes.SMALL,
  },
  list: {
    width: "100%",
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: AppColors.GREY,
    paddingHorizontal: Spacings.SMALL,
    paddingVertical: Spacings.STANDART,
    width: "100%",
  },
  itemText: {},
});
