import type { RefObject } from "react";

export interface SelectableActionListInterface {
  show: () => void;
  close: () => void;
}

export interface SelectableActionListOption<OptionId = string> {
  title: string;
  id: OptionId;
}

export interface SelectableActionListProps<OptionId = string> {
  title: string;
  ref?: RefObject<SelectableActionListInterface | null>;
  options: SelectableActionListOption<OptionId>[];
  onSelect: (id: SelectableActionListOption<OptionId>["id"]) => void;
}
