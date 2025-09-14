import React from "react";
import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

interface FormProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Form: React.FC<FormProps> = ({ children, style }) => {
  return <View style={[styles.form, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  form: {
    alignSelf: "center",
  },
});
