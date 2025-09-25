import React from "react";
import { Text } from "@/components/typography/Text";
import { RemoteNotificationsDebugger } from "@/components/notifications/RemoteNotificationsDebugger";
import { Screen } from "@/components/Screen";
import { FEATURE_FLAGS } from "@/constants/featureFlags";

const HomeScreen: React.FC = () => {
  return (
    <Screen>
      <Text>Home</Text>
      {FEATURE_FLAGS.SHOW_REMOTE_NOTIFICATIONS_DEBUGGER && (
        <RemoteNotificationsDebugger />
      )}
    </Screen>
  );
};

export default HomeScreen;
