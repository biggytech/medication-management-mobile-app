import { StyleSheet } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { Fonts, FontSizes } from "@/constants/styling/fonts";
import { Spacings } from "@/constants/styling/spacings";

export const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 1000,
    flex: 1,
    // backgroundColor: "red",
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: AppColors.WHITE,
    // borderRadius: 8,
    paddingHorizontal: Spacings.SMALL,
    paddingVertical: Spacings.SMALL,
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0)",
    height: 40,
    overflow: "hidden",
    maxHeight: 40,
    marginLeft: "auto",
    maxWidth: 45,
    // backgroundColor: "red",
  },
  expandedSearchContainer: {
    flex: 1,
    borderColor: AppColors.WHITE,
    maxWidth: "auto",
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.STANDART,
    color: AppColors.WHITE,
    fontFamily: Fonts.DEFAULT,
    paddingVertical: 0,
    // backgroundColor: "yellow",
  },
  searchIcon: {
    color: AppColors.WHITE,
  },
  searchIconExpanded: {
    marginRight: Spacings.SMALL,
  },
  clearIcon: {
    marginLeft: Spacings.SMALL,
    color: AppColors.WHITE,
  },
  clearIconImage: {
    color: AppColors.WHITE,
  },
  resultsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: AppColors.WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppColors.SECONDARY,
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    maxHeight: 300,
    zIndex: 1001,
    shadowColor: AppColors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 2,
  },
  resultItem: {
    padding: Spacings.SMALL,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.LIGHT_GRAY,
  },
  resultItemLast: {
    borderBottomWidth: 0,
  },
  doctorName: {
    fontSize: FontSizes.STANDART,
    fontWeight: "600",
    color: AppColors.FONT,
    marginBottom: 2,
  },
  doctorSpecialization: {
    fontSize: FontSizes.SMALL,
    color: AppColors.SECONDARY,
    marginBottom: 2,
  },
  doctorPlace: {
    fontSize: FontSizes.SMALL,
    color: AppColors.SECONDARY,
  },
  noResults: {
    padding: Spacings.STANDART,
    textAlign: "center",
    fontSize: FontSizes.STANDART,
    color: AppColors.SECONDARY,
  },
  loadingContainer: {
    padding: Spacings.STANDART,
    alignItems: "center",
  },
});
