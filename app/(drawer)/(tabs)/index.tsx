import React from "react";
import { Text } from "@/components/typography/Text";
import { PushNotificationDebugger } from "@/components/notifications/PushNotificationDebugger";
import { Screen } from "@/components/Screen";

const HomeScreen: React.FC = () => {
  return (
    <Screen>
      <Text>Home</Text>
      {/*<PushNotificationDebugger />*/}
    </Screen>
  );
};

export default HomeScreen;
