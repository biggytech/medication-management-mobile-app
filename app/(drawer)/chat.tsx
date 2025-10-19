import React from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { ChatService } from "@/services/chat/chatService";
import { ChatConversation } from "@/types/chatMessages";
import { ConversationItem } from "@/components/common/ConversationItem";
import { InlineLoader } from "@/components/common/loaders/InlineLoader";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { LanguageService } from "@/services/language/LanguageService";
import { AppColors } from "@/constants/styling/colors";
import { useQueryWithFocus } from "@/hooks/queries/useQueryWithFocus";

export default function ChatScreen() {
  const {
    data: conversations,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQueryWithFocus({
    queryKey: ["chat-conversations"],
    queryFn: ChatService.getConversations,
  });

  const handleConversationPress = (conversation: ChatConversation) => {
    router.push(`/chat/${conversation.otherUserId}`);
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <InlineLoader isLoading={isLoading} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorMessage
          text={LanguageService.translate("Failed to load conversations")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations || []}
        keyExtractor={(item) => {
          console.log("item", item);
          return item.otherUserId.toString();
        }}
        renderItem={({ item }) => (
          <ConversationItem
            conversation={item}
            onPress={() => handleConversationPress(item)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.BACKGROUND,
  },
  listContainer: {
    flexGrow: 1,
  },
});
