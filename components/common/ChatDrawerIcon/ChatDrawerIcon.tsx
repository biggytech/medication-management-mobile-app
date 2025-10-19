import React from "react";
import { StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { ChatService } from "@/services/chat/chatService";
import { AppColors } from "@/constants/styling/colors";
import { FontSizes } from "@/constants/styling/fonts";
import { Text } from "@/components/common/typography/Text";

interface ChatDrawerIconProps {
  focused: boolean;
  size: number;
  color: string;
}

export const ChatDrawerIcon: React.FC<ChatDrawerIconProps> = ({
  focused,
  size,
  color,
}) => {
  const { data: conversations = [] } = useQuery({
    queryKey: ["chat-conversations"],
    queryFn: ChatService.getConversations,
    refetchInterval: 30000, // Refetch every 30 seconds to keep count updated
  });

  // Calculate total unread count
  const totalUnreadCount = conversations.reduce((total, conversation) => {
    return total + conversation.unreadCount;
  }, 0);

  return (
    <View style={styles.container}>
      <Ionicons
        name="chatbubbles"
        size={size}
        color={focused ? AppColors.SECONDARY : color}
      />
      {totalUnreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: AppColors.NEGATIVE,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: AppColors.WHITE,
    fontSize: FontSizes.SMALL,
    fontWeight: "bold",
  },
});
