import { StyleSheet } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";
import { FontSizes } from "@/constants/styling/fonts";

export const styles = StyleSheet.create({
  medicineInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacings.STANDART,
  },
  medicineEmoji: {
    fontSize: FontSizes.HUGE,
    marginRight: Spacings.STANDART,
  },
  medicineDetails: {
    flex: 1,
  },
  medicineTitle: {
    fontSize: FontSizes.BIG,
    fontWeight: "bold",
    color: AppColors.FONT,
    marginBottom: Spacings.SMALL,
  },
  medicineDose: {
    fontSize: FontSizes.STANDART,
    color: AppColors.DARKGREY,
  },
  doseInfo: {
    backgroundColor: AppColors.GREY,
    borderRadius: Spacings.SMALL,
    padding: Spacings.STANDART,
    marginBottom: Spacings.STANDART,
  },
  doseInfoTitle: {
    fontSize: FontSizes.STANDART,
    fontWeight: "bold",
    color: AppColors.FONT,
    marginBottom: Spacings.SMALL,
  },
  doseInfoText: {
    fontSize: FontSizes.STANDART,
    color: AppColors.DARKGREY,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: Spacings.STANDART,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: Spacings.SMALL,
    paddingVertical: Spacings.STANDART,
    borderRadius: Spacings.SMALL,
    alignItems: "center",
  },
  takeButton: {
    backgroundColor: AppColors.POSITIVE,
  },
  skipButton: {
    backgroundColor: AppColors.NEGATIVE,
  },
  rescheduleButton: {
    backgroundColor: AppColors.ACCENT,
  },
  actionButtonText: {
    color: AppColors.WHITE,
    fontSize: FontSizes.STANDART,
    fontWeight: "bold",
  },
  doseList: {
    marginTop: Spacings.STANDART,
  },
  doseItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacings.STANDART,
    backgroundColor: AppColors.WHITE,
    borderRadius: Spacings.SMALL,
    marginBottom: Spacings.SMALL,
    borderWidth: 1,
    borderColor: AppColors.GREY,
  },
  doseTime: {
    fontSize: FontSizes.BIG,
    fontWeight: "bold",
    color: AppColors.FONT,
    marginRight: Spacings.STANDART,
  },
  doseStatus: {
    flex: 1,
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: Spacings.SMALL,
    paddingVertical: Spacings.SMALL / 2,
    borderRadius: Spacings.SMALL,
  },
  statusText: {
    fontSize: FontSizes.SMALL,
    fontWeight: "bold",
    color: AppColors.WHITE,
  },
});
