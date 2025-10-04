import { StyleSheet } from "react-native";
import { Spacings } from "@/constants/styling/spacings";
import { AppColors } from "@/constants/styling/colors";
import { FontSizes } from "@/constants/styling/fonts";

export const styles = StyleSheet.create({
  detailsContainer: {
    borderRadius: 12,
    padding: Spacings.STANDART,
    marginBottom: Spacings.BIG,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacings.SMALL,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.GREY,
  },
  detailLabel: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailLabelText: {
    fontSize: FontSizes.STANDART,
    fontWeight: "600",
    marginLeft: Spacings.SMALL,
  },
  detailValue: {
    fontSize: FontSizes.STANDART,
    flex: 1,
    textAlign: "right",
  },
});
