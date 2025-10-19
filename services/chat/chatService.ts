import { APIService, Methods } from "../APIService";
import {
  ChatConversation,
  ChatConversationsResponse,
  ChatMessage,
  ChatMessageResponse,
  ChatMessagesResponse,
  SendMessageRequest,
} from "../../types/chatMessages";

export class ChatService {
  private static readonly BASE_URL = "/chat-messages";

  /**
   * Get all conversations for the current user
   */
  static async getConversations(): Promise<ChatConversation[]> {
    const response =
      await APIService.getInstance().makeRequest<ChatConversationsResponse>({
        method: Methods.GET,
        url: `${ChatService.BASE_URL}/conversations`,
        requiresAuth: true,
      });

    // if (!response.success || !response.data) {
    //   throw new Error(response.error || "Failed to fetch conversations");
    // }

    return response.data ?? [];
  }

  /**
   * Get messages in a conversation between current user and another user
   */
  static async getConversationMessages(
    otherUserId: number,
    limit: number = 50,
    offset: number = 0,
  ): Promise<ChatMessage[]> {
    const response =
      await APIService.getInstance().makeRequest<ChatMessagesResponse>({
        method: Methods.GET,
        url: `${ChatService.BASE_URL}/conversations/${otherUserId}/messages?limit=${limit}&offset=${offset}`,
        requiresAuth: true,
      });

    return response.data ?? [];
  }

  /**
   * Send a new message
   */
  static async sendMessage(
    messageData: SendMessageRequest,
  ): Promise<ChatMessage> {
    const response =
      await APIService.getInstance().makeRequest<ChatMessageResponse>({
        method: Methods.POST,
        url: `${ChatService.BASE_URL}/messages`,
        requiresAuth: true,
        body: messageData,
      });

    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to send message");
    }

    return response.data;
  }

  /**
   * Mark all messages in a conversation as read
   */
  static async markConversationAsRead(
    otherUserId: number,
  ): Promise<{ updated_count: number }> {
    const response = await APIService.getInstance().makeRequest<{
      success: boolean;
      data: { updated_count: number };
      error?: string;
    }>({
      method: Methods.POST,
      url: `${ChatService.BASE_URL}/conversations/${otherUserId}/mark-read`,
      requiresAuth: true,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to mark conversation as read");
    }

    return response.data;
  }

  /**
   * Delete a message
   */
  static async deleteMessage(messageId: number): Promise<void> {
    const response = await APIService.getInstance().makeRequest<{
      success: boolean;
      error?: string;
    }>({
      method: Methods.DELETE,
      url: `${ChatService.BASE_URL}/messages/${messageId}`,
      requiresAuth: true,
    });

    if (!response.success) {
      throw new Error(response.error || "Failed to delete message");
    }
  }
}
