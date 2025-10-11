import type { RefObject } from "react";

export interface SelectableActionListInterface<> {
  show: () => void;
}

export interface SelectableActionListOption {
  title: string;
  id: string;
}

export interface SelectableActionListProps {
  title: string;
  ref?: RefObject<SelectableActionListInterface | null>;
  options: SelectableActionListOption[];
  onSelect: (id: SelectableActionListOption["id"]) => void;
}
