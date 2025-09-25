import { StyleSheet } from "react-native";
import { Spacings } from "@/constants/styling/spacings";
import { AppColors } from "@/constants/styling/colors";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: Spacings.SMALL,
  },
  day: {
    width: "14.28%",
    alignItems: "center",
    paddingVertical: 10,
  },
  selected: {
    backgroundColor: AppColors.PRIMARY,
    borderRadius: 8,
  },
});
