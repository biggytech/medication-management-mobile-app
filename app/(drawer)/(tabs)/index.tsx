import React from "react";
import { Text } from "@/components/typography/Text";
import { PushNotificationDebugger } from "@/components/notifications/PushNotificationDebugger";
import { Screen } from "@/components/Screen";

const Home: React.FC = () => {
  return (
    <Screen>
      <Text>Home</Text>
      {/*<PushNotificationDebugger />*/}
    </Screen>
  );
};

export default Home;
