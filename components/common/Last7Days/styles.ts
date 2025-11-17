import { StyleSheet } from "react-native";
import { CIRCLE_SIZE } from "./constants";
import { Spacings } from "@/constants/styling/spacings";
import { FontSizes } from "@/constants/styling/fonts";
import { AppColors } from "@/constants/styling/colors";
import { transparentColor } from "@/utils/ui/transparentColor";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacings.STANDART,
    paddingVertical: Spacings.SMALL,
  },
  daysRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacings.SMALL,
  },
  dayContainer: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: Spacings.SMALL,
  },
  arrowButton: {
    marginHorizontal: Spacings.SMALL,
  },
  dayName: {
    fontSize: FontSizes.SMALL,
    marginBottom: 2,
  },
  dayNameActive: {
    color: AppColors.ACCENT,
  },
  dayNumberContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  dayNumberContainerActive: {
    backgroundColor: AppColors.ACCENT,
    borderRadius: "50%",
  },
  dayNumber: {
    fontSize: FontSizes.STANDART,
  },
  dayNumberActive: {
    color: AppColors.WHITE,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    minHeight: 24,
  },
  activeDateText: {
    fontSize: FontSizes.STANDART,
    color: AppColors.ACCENT,
    textAlign: "center",
    fontWeight: 600,
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 0,
  },
  returnBackButton: {
    paddingHorizontal: Spacings.SMALL,
    paddingVertical: 3,
    backgroundColor: transparentColor(AppColors.ACCENT, 0.5),
    borderRadius: 16,
    zIndex: 1,
  },
  returnBackButtonText: {
    fontSize: FontSizes.SMALL,
    color: AppColors.WHITE,
    fontWeight: 600,
  },
});
