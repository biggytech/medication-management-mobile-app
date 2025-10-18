import { StyleSheet } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { FontSizes } from "@/constants/styling/fonts";
import { Spacings } from "@/constants/styling/spacings";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: 500,
    // minHeight: 500,
    // backgroundColor: "yellow",
  },
  description: {
    fontSize: FontSizes.STANDART,
    color: AppColors.FONT,
    marginBottom: Spacings.STANDART,
    textAlign: "center",
    lineHeight: 22,
  },
  doctorsList: {
    flex: 1,
    // height: 200,
    // backgroundColor: "red",
    // minHeight: 200,
    maxHeight: 200,
  },
  doctorItem: {
    height: 75,
    backgroundColor: AppColors.WHITE,
    borderRadius: Spacings.SMALL,
    paddingHorizontal: Spacings.STANDART,
    paddingVertical: Spacings.SMALL,
    marginBottom: Spacings.SMALL,
    borderWidth: 1,
    borderColor: AppColors.GREY,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  doctorInfo: {
    flex: 1,
    // backgroundColor: "red",
  },
  doctorName: {
    fontSize: FontSizes.STANDART,
    fontWeight: "600",
    color: AppColors.FONT,
    // marginBottom: Spacings.SMALL,
  },
  doctorSpecialization: {
    fontSize: FontSizes.STANDART,
    color: AppColors.PRIMARY,
    // marginBottom: Spacings.SMALL,
  },
  doctorPlaceOfWork: {
    fontSize: FontSizes.SMALL,
    color: AppColors.GREY,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacings.BIG,
  },
  emptyStateText: {
    fontSize: FontSizes.STANDART,
    color: AppColors.GREY,
    textAlign: "center",
  },
});
