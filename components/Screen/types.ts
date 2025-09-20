import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface ScreenProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}
