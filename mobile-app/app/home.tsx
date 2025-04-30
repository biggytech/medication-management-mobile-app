import type { ReactNode } from "react";
import { Text, View } from "react-native";

// TODO: styles
// TODO: translations
export default function Home(): ReactNode {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Home</Text>
    </View>
  );
}
