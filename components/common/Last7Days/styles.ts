import { StyleSheet } from "react-native";
import { CIRCLE_SIZE } from "./constants";
import { Spacings } from "@/constants/styling/spacings";
import { FontSizes } from "@/constants/styling/fonts";
import { AppColors } from "@/constants/styling/colors";

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
  activeDateText: {
    fontSize: FontSizes.STANDART,
    color: AppColors.ACCENT,
    textAlign: "center",
    fontWeight: 600,
  },
});
