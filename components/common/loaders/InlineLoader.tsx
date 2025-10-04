import React from "react";
import { View, StyleSheet } from "react-native";
import { Loader } from "@/components/common/loaders/Loader";

interface InlineLoaderProps {
  isLoading: boolean;
}

export const InlineLoader: React.FC<InlineLoaderProps> = ({ isLoading }) => {
  return (
    <View
      style={[styles.container, isLoading ? styles.containerVisible : {}]}
      aria-hidden={!isLoading}
    >
      <Loader />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    opacity: 0,
  },
  containerVisible: {
    opacity: 1,
  },
});
