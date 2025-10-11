import type { ReactNode } from "react";

export interface ModalWithBackDropProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  isLoading?: boolean;
}
