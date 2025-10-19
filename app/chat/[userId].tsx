import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { ChatService } from "@/services/chat/chatService";
import { ChatMessage } from "@/types/chatMessages";
import { MessageBubble } from "@/components/common/MessageBubble";
import { MessageInput } from "@/components/common/MessageInput";
import { Header } from "@/components/common/Header";
import { InlineLoader } from "@/components/common/loaders/InlineLoader";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { LanguageService } from "@/services/language/LanguageService";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";
import { Text } from "@/components/common/typography/Text";
import { IconButton } from "@/components/common/buttons/IconButton";
import { useAuthSession } from "@/providers/AuthProvider";
import { Title } from "@/components/common/typography/Title";
import { useQueryWithFocus } from "@/hooks/queries/useQueryWithFocus";

export default function ChatDetailScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const queryClient = useQueryClient();
  const { currentUser } = useAuthSession();

  const {
    data: { messages: initialMessages = [], otherUserName = "" } = {},
    isLoading,
    error,
    refetch,
  } = useQueryWithFocus({
    queryKey: ["chat-messages", userId],
    queryFn: () => ChatService.getConversationMessages(Number(userId)),
    enabled: !!userId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (message: string) =>
      ChatService.sendMessage({
        receiverId: Number(userId),
        message,
      }),
    onSuccess: (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      // Mark conversation as read
      ChatService.markConversationAsRead(Number(userId));
    },
    onError: (error) => {
      Alert.alert(
        LanguageService.translate("Error"),
        LanguageService.translate("Failed to send message"),
      );
    },
  });

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages.reverse()); // Reverse to show oldest first
    }
  }, [initialMessages, currentUser.id]);

  useEffect(() => {
    // Mark conversation as read when user opens it
    if (userId) {
      ChatService.markConversationAsRead(Number(userId));
    }
  }, [userId]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        // Scroll to bottom when keyboard appears
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSendMessage = (message: string) => {
    sendMessageMutation.mutate(message);
  };

  const handleRefresh = () => {
    refetch();
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    // Use the current user ID from auth context
    const isCurrentUser = item.senderId === currentUser.id;

    return <MessageBubble message={item} isCurrentUser={isCurrentUser} />;
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header
          left={
            <IconButton onPress={() => router.back()} iconName={"arrow-back"} />
          }
        >
          <Text>{otherUserName || LanguageService.translate("Chat")}</Text>
        </Header>
        <InlineLoader isLoading={isLoading} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header
          left={
            <IconButton onPress={() => router.back()} iconName={"arrow-back"} />
          }
        >
          <Text>{otherUserName || LanguageService.translate("Chat")}</Text>
        </Header>
        <ErrorMessage
          text={LanguageService.translate("Failed to load messages")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        left={
          <IconButton onPress={() => router.back()} iconName={"arrow-back"} />
        }
      >
        <Title
          style={{
            color: AppColors.WHITE,
            // alignSelf: "center",
            marginTop: Spacings.SMALL,
          }}
        >
          {otherUserName || LanguageService.translate("Chat")}
        </Title>
      </Header>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMessage}
          style={[
            styles.messagesList,
            { marginBottom: keyboardHeight > 0 ? 0 : 0 },
          ]}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          showsVerticalScrollIndicator={false}
        />
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={sendMessageMutation.isPending}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.BACKGROUND,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingVertical: Spacings.SMALL,
    flexGrow: 1,
  },
});
