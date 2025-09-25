import { StyleSheet } from "react-native";
import { Spacings } from "@/constants/styling/spacings";

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
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  scrollContainer: {
    width: "100%",
    maxHeight: 200,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacings.SMALL,
  },
  time: {
    flex: 1,
  },
  action: {
    marginLeft: Spacings.SMALL,
  },
});
