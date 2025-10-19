import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { FontSizes } from "@/constants/styling/fonts";
import { Spacings } from "@/constants/styling/spacings";
import { LanguageService } from "@/services/language/LanguageService";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder,
}) => {
  const defaultPlaceholder =
    placeholder || LanguageService.translate("Type a message...");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder={defaultPlaceholder}
        placeholderTextColor={AppColors.DARKGREY}
        multiline
        maxLength={2000}
        editable={!disabled}
        returnKeyType="send"
        onSubmitEditing={handleSend}
        blurOnSubmit={false}
        scrollEnabled={true}
      />
      <TouchableOpacity
        style={[styles.sendButton, disabled && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={disabled || !message.trim()}
      >
        <Text
          style={[
            styles.sendButtonText,
            disabled && styles.sendButtonTextDisabled,
          ]}
        >
          {LanguageService.translate("Send")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: Spacings.STANDART,
    paddingVertical: Spacings.SMALL,
    backgroundColor: AppColors.WHITE,
    borderTopWidth: 1,
    borderTopColor: AppColors.LIGHT_GRAY,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: AppColors.LIGHT_GRAY,
    borderRadius: 20,
    paddingHorizontal: Spacings.STANDART,
    paddingVertical: Spacings.SMALL,
    fontSize: FontSizes.STANDART,
    color: AppColors.FONT,
    maxHeight: 100,
    marginRight: Spacings.SMALL,
  },
  sendButton: {
    backgroundColor: AppColors.PRIMARY,
    paddingHorizontal: Spacings.STANDART,
    paddingVertical: Spacings.SMALL,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: AppColors.GREY,
  },
  sendButtonText: {
    color: AppColors.WHITE,
    fontSize: FontSizes.STANDART,
    fontWeight: "bold",
  },
  sendButtonTextDisabled: {
    color: AppColors.DARKGREY,
  },
});
