import { StyleSheet } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";
import { transparentColor } from "@/utils/ui/transparentColor";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    flex: 1,
  },
  list: {
    width: "100%",
    flex: 1,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: AppColors.GREY,
    paddingHorizontal: Spacings.SMALL,
    paddingVertical: Spacings.STANDART,
    width: "100%",
  },
  activeItem: {
    backgroundColor: transparentColor(AppColors.PRIMARY, 0.1),
  },
  itemText: {},
});
