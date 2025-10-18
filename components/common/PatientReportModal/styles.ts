import { StyleSheet } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";
import { FontSizes } from "@/constants/styling/fonts";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  datePickerContainer: {
    marginBottom: Spacings.STANDART,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacings.BIG,
  },
  button: {
    // flex: 1,
    marginHorizontal: Spacings.SMALL,
    padding: Spacings.SMALL,
    minHeight: "auto",
    // height: 30,
  },
  patientName: {
    fontSize: FontSizes.BIG,
    fontWeight: "bold",
    color: AppColors.FONT,
    textAlign: "center",
    marginBottom: Spacings.STANDART,
  },
});
