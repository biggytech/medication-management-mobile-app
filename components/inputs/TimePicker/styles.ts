import { StyleSheet } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  labelContainer: {
    width: "100%",
  },
  label: {},
  control: {
    width: 150,
    paddingVertical: Spacings.SMALL,
    paddingLeft: Spacings.STANDART,
    paddingRight: Spacings.SMALL,
    borderRadius: Spacings.SMALL,
    borderWidth: 1,
    borderColor: AppColors.GREY,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  controlText: {
    color: AppColors.FONT,
  },
  errored: {
    borderWidth: 1,
    borderColor: AppColors.NEGATIVE,
  },
  clearButtonContainer: {
    alignSelf: "flex-start",
  },
  clearButtonStyle: {
    marginTop: 2,
  },
});
