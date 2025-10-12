import { StyleSheet } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";

export const styles = StyleSheet.create({
  container: {
    marginBottom: Spacings.SMALL,
  },
  labelContainer: {
    marginBottom: Spacings.SMALL,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: AppColors.FONT,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: AppColors.POSITIVE,
  },
  toggleInactive: {
    backgroundColor: AppColors.GREY,
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: AppColors.WHITE,
    shadowColor: AppColors.FONT,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  thumbActive: {
    alignSelf: "flex-end",
  },
  thumbInactive: {
    alignSelf: "flex-start",
  },
  errorText: {
    color: AppColors.NEGATIVE,
    fontSize: 14,
    marginTop: Spacings.SMALL,
  },
});
