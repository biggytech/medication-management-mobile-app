import type { ReactNode } from "react";

export interface RoundProps {
  children: ReactNode;
  small?: boolean;
  shadow?: boolean;
  approved?: boolean;
}
