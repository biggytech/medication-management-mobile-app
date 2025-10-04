import type { StyleProp, TextInputProps, ViewStyle } from "react-native";

export interface InputProps extends TextInputProps {
  error?: string | null;
  containerStyle?: StyleProp<ViewStyle>;
}
