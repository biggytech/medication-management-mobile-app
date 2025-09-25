import { StyleSheet } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  labelContainer: {
    width: "100%",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  control: {
    width: "100%",
    paddingVertical: Spacings.SMALL,
    paddingHorizontal: Spacings.STANDART,
    borderRadius: 12,
    backgroundColor: AppColors.GREY,
  },
  controlText: {
    color: AppColors.FONT,
  },
  errored: {
    borderWidth: 1,
    borderColor: AppColors.NEGATIVE,
  },
  clearButton: {
    marginTop: Spacings.SMALL,
    paddingVertical: Spacings.SMALL,
    paddingHorizontal: Spacings.STANDART,
    borderRadius: 8,
    backgroundColor: AppColors.GREY,
    alignSelf: "flex-start",
  },
  clearButtonText: {
    color: AppColors.FONT,
    fontSize: 14,
    fontWeight: "500",
  },
});
