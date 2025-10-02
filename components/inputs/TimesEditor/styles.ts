import { StyleSheet } from "react-native";
import { Spacings } from "@/constants/styling/spacings";
import { FontSizes } from "@/constants/styling/fonts";

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
    fontSize: FontSizes.STANDART,
    textAlign: "center",
  },
  scrollContainer: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacings.SMALL,
    marginBottom: Spacings.STANDART,
  },
  time: {},
  removeButton: {
    marginLeft: Spacings.SMALL,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  addButtonContainer: {
    marginTop: Spacings.STANDART,
  },
});
