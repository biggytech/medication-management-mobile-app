import { StyleSheet } from "react-native";
import { transparentColor } from "@/utils/ui/transparentColor";
import { AppColors } from "@/constants/styling/colors";

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: transparentColor(AppColors.WHITE, 0.5),
  },
});
