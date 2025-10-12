import { StyleSheet } from "react-native";
import { Spacings } from "@/constants/styling/spacings";

export const styles = StyleSheet.create({
  screen: {
    width: "100%",
    alignItems: "center",
    flex: 1,
  },
  labelContainer: {
    width: "100%",
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  timeEditor: {
    flex: 1,
    marginTop: Spacings.SMALL,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacings.SMALL,
  },
});
