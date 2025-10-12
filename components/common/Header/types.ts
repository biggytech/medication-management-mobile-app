import type { ReactNode } from "react";

export interface HeaderProps {
  children: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  color?: string; // Optional background color prop
}
