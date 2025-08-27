import React from "react";
import { Text } from "@/components/typography/Text";
import { View } from "react-native";
import { PushNotificationDebugger } from "@/components/notifications/PushNotificationDebugger";

const Home: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <Text>Home</Text>
      <PushNotificationDebugger />
    </View>
  );
};

export default Home;
