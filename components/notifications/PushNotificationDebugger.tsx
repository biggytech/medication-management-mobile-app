import React from "react";
import { Text, View, Button } from "react-native";
import { usePushNotifications } from "@/hooks/notifications/usePushNotifications";
import { schedulePushNotification } from "@/utils/notifications/schedulePushNotification";
import { SchedulableTriggerInputTypes } from "expo-notifications";

export const PushNotificationDebugger: React.FC = () => {
  const { expoPushToken, notification, channels } = usePushNotifications();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      <Text>Your expo push token: {expoPushToken}</Text>
      <Text>{`Channels: ${JSON.stringify(
        channels.map((c) => c.id),
        null,
        2,
      )}`}</Text>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>
          Title: {notification && notification.request.content.title}{" "}
        </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>
          Data:{" "}
          {notification && JSON.stringify(notification.request.content.data)}
        </Text>
      </View>
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification(
            {
              title: "You've got mail! 📬",
              body: "Here is the notification body",
              data: { data: "goes here", test: { test1: "more data" } },
            },
            {
              type: SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: 2,
            },
          );
        }}
      />
    </View>
  );
};
