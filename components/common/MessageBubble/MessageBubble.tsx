import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ChatMessage } from "@/types/chatMessages";
import { AppColors } from "@/constants/styling/colors";
import { FontSizes } from "@/constants/styling/fonts";
import { Spacings } from "@/constants/styling/spacings";
import { formatTime } from "@/utils/date/formatTime";

interface MessageBubbleProps {
  message: ChatMessage;
  isCurrentUser: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
}) => {
  return (
    <View
      style={[
        styles.container,
        isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isCurrentUser ? styles.currentUserText : styles.otherUserText,
          ]}
        >
          {message.message}
        </Text>
        <Text
          style={[
            styles.timeText,
            isCurrentUser ? styles.currentUserTime : styles.otherUserTime,
          ]}
        >
          {formatTime(new Date(message.createdAt))}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacings.SMALL / 2,
    paddingHorizontal: Spacings.STANDART,
  },
  currentUserContainer: {
    alignItems: "flex-end",
  },
  otherUserContainer: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: Spacings.STANDART,
    paddingVertical: Spacings.SMALL,
    borderRadius: 20,
  },
  currentUserBubble: {
    backgroundColor: AppColors.PRIMARY,
    borderBottomRightRadius: 5,
  },
  otherUserBubble: {
    backgroundColor: AppColors.LIGHT_GRAY,
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: FontSizes.STANDART,
    lineHeight: 20,
  },
  currentUserText: {
    color: AppColors.WHITE,
  },
  otherUserText: {
    color: AppColors.FONT,
  },
  timeText: {
    fontSize: FontSizes.SMALL,
    marginTop: Spacings.SMALL / 2,
    textAlign: "right",
  },
  currentUserTime: {
    color: AppColors.WHITE,
    opacity: 0.8,
  },
  otherUserTime: {
    color: AppColors.DARKGREY,
  },
});
