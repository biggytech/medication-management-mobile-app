import type { RefObject } from "react";

export interface SelectableActionListInterface<> {
  show: () => void;
}

export interface SelectableActionListOption<OptionId extends string = string> {
  title: string;
  id: OptionId;
}

export interface SelectableActionListProps<OptionId extends string = string> {
  title: string;
  ref?: RefObject<SelectableActionListInterface | null>;
  options: SelectableActionListOption<OptionId>[];
  onSelect: (id: SelectableActionListOption<OptionId>["id"]) => void;
}
