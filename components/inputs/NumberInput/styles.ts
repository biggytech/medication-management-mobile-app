import { StyleSheet } from "react-native";
import { AppColors } from "@/constants/styling/colors";
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
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.GREY,
    borderRadius: 12,
    overflow: "hidden",
  },
  button: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColors.PRIMARY,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: AppColors.WHITE,
  },
  input: {
    flex: 1,
    paddingVertical: Spacings.SMALL,
    paddingHorizontal: Spacings.STANDART,
    fontSize: 16,
    color: AppColors.FONT,
    textAlign: "center",
  },
  errored: {
    borderWidth: 1,
    borderColor: AppColors.NEGATIVE,
  },
});
