import { StyleSheet, View } from "react-native";
import { Loader } from "@/components/Loader";

export const CenteredLoader = () => {
  return (
    <View style={styles.container}>
      <Loader />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
