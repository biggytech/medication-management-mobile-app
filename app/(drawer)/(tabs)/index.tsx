import React from "react";
import { Text } from "@/components/Text";
import { View } from "react-native";
import { PushNotificationDebugger } from "@/components/notifications/PushNotificationDebugger";

const Home: React.FC = () => {
  return (
    <View>
      <Text>Home</Text>;
      <PushNotificationDebugger />
    </View>
  );
};

export default Home;
