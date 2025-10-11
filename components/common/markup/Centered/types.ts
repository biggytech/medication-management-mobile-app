import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface CenteredProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}
