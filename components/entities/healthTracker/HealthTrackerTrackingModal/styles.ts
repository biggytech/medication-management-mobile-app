import { StyleSheet } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { FontSizes } from "@/constants/styling/fonts";
import { Spacings } from "@/constants/styling/spacings";

export const styles = StyleSheet.create({
  form: {
    gap: Spacings.SMALL,
  },
  fieldContainer: {
    gap: Spacings.SMALL,
  },
  fieldLabel: {
    fontSize: FontSizes.STANDART,
    fontWeight: "600",
    color: AppColors.FONT,
    marginBottom: Spacings.SMALL,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  unitLabel: {
    fontSize: FontSizes.STANDART,
    fontWeight: "600",
    color: AppColors.DARKGREY,
    paddingHorizontal: Spacings.STANDART,
    paddingVertical: Spacings.SMALL,
    borderRadius: 8,
    minWidth: 60,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: Spacings.STANDART,
    marginTop: Spacings.STANDART,
  },
  button: {
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  loadingText: {
    fontSize: FontSizes.STANDART,
    fontWeight: "600",
    color: AppColors.PRIMARY,
    marginTop: Spacings.STANDART,
  },
});
