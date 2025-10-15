import type { ReactNode } from "react";

export interface GradientHeaderProps {
  children: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  colors?: [string, string, ...string[]];
}
