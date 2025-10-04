export interface SelectableListOption {
  title: string;
  id: string;
}

export interface SelectableListProps {
  options: SelectableListOption[];
  selectedId: SelectableListOption["id"];
  onSelect: (id: SelectableListOption["id"]) => void;
}
