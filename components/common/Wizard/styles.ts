import { StyleSheet } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.SECONDARY,
    flex: 1,
  },
  controls: {
    padding: Spacings.SMALL,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    padding: Spacings.STANDART,
  },
  title: {
    color: AppColors.WHITE,
  },
  progressBarContainer: {
    paddingHorizontal: Spacings.STANDART,
  },
  progressBar: {
    height: 4,
    overflow: "hidden",
    backgroundColor: AppColors.GREY,
  },
  progress: {
    backgroundColor: AppColors.PRIMARY,
    height: "100%",
    transform: [{ translateX: -10000 }],
  },
  content: {
    width: "100%",
    flex: 1,
    backgroundColor: "grey",
  },
  screens: {},
  screen: {
    flex: 1,
    flexShrink: 0,
    flexGrow: 1,
  },
  node: {
    backgroundColor: AppColors.WHITE,
    borderTopLeftRadius: Spacings.SMALL,
    borderTopRightRadius: Spacings.SMALL,
    flex: 1,
    padding: Spacings.STANDART,
    alignItems: "center",
    width: "100%",
  },
});
