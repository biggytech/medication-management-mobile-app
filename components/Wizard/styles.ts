import { StyleSheet } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.ACCENT,
  },
  controls: {
    padding: Spacings.SMALL,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressBar: {
    height: 6,
    overflow: "hidden",
    backgroundColor: AppColors.DISABLED,
  },
  progress: {
    backgroundColor: AppColors.WHITE,
    height: "100%",
    transform: [{ translateX: -10000 }],
  },
  content: {
    width: "100%",
    overflow: "hidden",
  },
  screens: {},
  screen: {
    width: "100%",
    padding: Spacings.STANDART,
  },
  node: {},
  bottom: {},
});
