import { UserFromApi } from "@/types/users";

export interface ChatMessage {
  id: number;
  senderId: number;
  receiverId: number;
  message: string;
  createdAt: string;
  isRead: boolean;
  senderName?: string;
  receiverName?: string;
}

export interface ChatConversation {
  otherUserId: number;
  otherUserName: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  photoUrl?: string;
}

export interface SendMessageRequest {
  receiverId: number;
  message: string;
}

export interface ChatMessageResponse {
  success: boolean;
  data?: ChatMessage;
  error?: string;
}

export interface ChatConversationsResponse {
  success: boolean;
  data?: ChatConversation[];
  error?: string;
}

export interface ChatMessagesResponse {
  success: boolean;
  data?: ChatMessage[];
  error?: string;
  otherUser: UserFromApi;
}
