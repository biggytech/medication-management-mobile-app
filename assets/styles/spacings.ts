import { StyleSheet } from "react-native";
import { Spacings } from "@/constants/styling/spacings";

export const marginStyles = StyleSheet.create({
  small: {
    margin: Spacings.SMALL,
  },
  standart: {
    margin: Spacings.STANDART,
  },
  big: {
    margin: Spacings.BIG,
  },
  huge: {
    margin: Spacings.HUGE,
  },
  bottomSmall: {
    marginBottom: Spacings.SMALL,
  },
  bottomStandart: {
    marginBottom: Spacings.STANDART,
  },
  bottomBig: {
    marginBottom: Spacings.BIG,
  },
  bottomHuge: {
    marginBottom: Spacings.HUGE,
  },
});

export const paddingStyles = StyleSheet.create({
  small: {
    padding: Spacings.SMALL,
  },
  standart: {
    padding: Spacings.STANDART,
  },
  big: {
    padding: Spacings.BIG,
  },
  huge: {
    padding: Spacings.HUGE,
  },
});
