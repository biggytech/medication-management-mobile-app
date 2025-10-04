import { StyleSheet } from "react-native";
import { Spacings } from "@/constants/styling/spacings";

export const styles = StyleSheet.create({
  header: {
    marginBottom: Spacings.BIG,
    flexDirection: "row",
    justifyContent: "center",
  },
  action: {
    width: 40,
    paddingTop: Spacings.SMALL,
    alignItems: "center",
  },
  left: {
    marginRight: "auto",
  },
  right: {
    marginLeft: "auto",
  },
  center: {},
});
