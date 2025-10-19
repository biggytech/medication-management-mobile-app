import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ChatConversation } from "@/types/chatMessages";
import { AppColors } from "@/constants/styling/colors";
import { FontSizes } from "@/constants/styling/fonts";
import { Spacings } from "@/constants/styling/spacings";
import { LanguageService } from "@/services/language/LanguageService";
import { formatDate } from "@/utils/date/formatDate";
import { Avatar } from "@/components/common/Avatar";
import { getAbsolutePhotoUrl } from "@/utils/ui/getAbsolutePhotoUrl";

interface ConversationItemProps {
  conversation: ChatConversation;
  onPress: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.avatarContainer}>
        <Avatar
          name={conversation.otherUserName}
          photoUrl={getAbsolutePhotoUrl(conversation.photoUrl)}
          size={50}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {conversation.otherUserName}
          </Text>
          {conversation.lastMessageTime && (
            <Text style={styles.time}>
              {formatDate(new Date(conversation.lastMessageTime))}
            </Text>
          )}
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {conversation.lastMessage ||
              LanguageService.translate("No messages yet")}
          </Text>
          {conversation.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {conversation.unreadCount > 99
                  ? "99+"
                  : conversation.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: Spacings.STANDART,
    paddingVertical: Spacings.STANDART,
    backgroundColor: AppColors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.LIGHT_GRAY,
  },
  avatarContainer: {
    marginRight: Spacings.STANDART,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacings.SMALL / 2,
  },
  name: {
    fontSize: FontSizes.STANDART,
    fontWeight: "bold",
    color: AppColors.FONT,
    flex: 1,
  },
  time: {
    fontSize: FontSizes.SMALL,
    color: AppColors.DARKGREY,
    marginLeft: Spacings.SMALL,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lastMessage: {
    fontSize: FontSizes.STANDART,
    color: AppColors.DARKGREY,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: AppColors.NEGATIVE,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: Spacings.SMALL,
  },
  unreadText: {
    fontSize: FontSizes.SMALL,
    color: AppColors.WHITE,
    fontWeight: "bold",
  },
});
