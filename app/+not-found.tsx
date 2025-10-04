import { Link, Stack } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { Screen } from "@/components/common/markup/Screen";

// TODO: styles
// TODO: translations
export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Screen>
        <Text>This screen does not exist.</Text>
        <Link href="/" style={styles.link}>
          <Text>Go to home screen!</Text>
        </Link>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
