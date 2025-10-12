import React from "react";
import type { ModalWithBackDropProps } from "@/components/common/ModalWithBackDrop/types";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/typography/Text";

import { styles } from "./styles";
import { OverlayLoader } from "@/components/common/loaders/OverlayLoader";

const ModalWithBackDrop: React.FC<ModalWithBackDropProps> = ({
  title,
  onClose,
  children,
  isLoading = false,
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

          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={styles.modalContent}
          >
            {children}
          </ScrollView>
          {isLoading && <OverlayLoader style={styles.loader} />}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default React.memo(ModalWithBackDrop);
