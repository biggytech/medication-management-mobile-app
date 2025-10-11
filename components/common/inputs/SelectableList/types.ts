export interface SelectableListOption {
  title: string;
  id: string;
}

export interface SelectableListProps {
  options: SelectableListOption[];
  selectedId: SelectableListOption["id"] | null;
  onSelect: (id: SelectableListOption["id"]) => void;
}
