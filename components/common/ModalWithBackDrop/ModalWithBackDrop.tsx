import React from "react";
import type { ModalWithBackDropProps } from "@/components/common/ModalWithBackDrop/types";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/typography/Text";

import { styles } from "./styles";

const ModalWithBackDrop: React.FC<ModalWithBackDropProps> = ({
  title,
  onClose,
  children,
}) => {
  return (
    <Modal
      visible
      transparent
      animationType="none"
      onRequestClose={onClose}
      onDismiss={onClose}
    >
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
          </View>

          <ScrollView style={styles.modalContent}>{children}</ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default React.memo(ModalWithBackDrop);
