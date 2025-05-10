import { ActivityIndicator, StyleSheet } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";

export const Loader = () => {
  return (
    <ActivityIndicator
      size="large"
      color={AppColors.PRIMARY}
      style={styles.loader}
      aria-label={"Loading..."}
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    margin: Spacings.STANDART,
  },
});
