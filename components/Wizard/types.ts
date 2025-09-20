import type { ReactNode } from "react";

export interface Screen {
  key: string;
  node: ReactNode;
}

export interface WizardProps {
  screens: Screen[];
}
