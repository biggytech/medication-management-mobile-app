import { StyleSheet } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";
import { FontSizes } from "@/constants/styling/fonts";

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: AppColors.WHITE,
    borderRadius: Spacings.STANDART,
    margin: Spacings.STANDART,
    maxHeight: "80%",
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacings.STANDART,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.GREY,
  },
  modalTitle: {
    fontSize: FontSizes.BIG,
    fontWeight: "bold",
    color: AppColors.FONT,
  },
  modalContent: {
    padding: Spacings.STANDART,
  },
});
