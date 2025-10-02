import { StyleSheet } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";
import { FontSizes } from "@/constants/styling/fonts";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: Spacings.SMALL,
  },
  labelContainer: {},
  label: {
    fontSize: FontSizes.STANDART,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    height: Spacings.BIG,
    width: Spacings.BIG,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColors.PRIMARY,
    borderRadius: "50%",
    marginHorizontal: Spacings.SMALL,
  },
  buttonText: {
    fontSize: FontSizes.HUGE,
    fontWeight: "bold",
    color: AppColors.WHITE,
    lineHeight: FontSizes.HUGE,
  },
  input: {
    marginTop: Spacings.SMALL,
    textAlign: "center",
  },
});
