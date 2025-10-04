export interface DetailsCardItem {
  key: "string";
  iconName: string;
  label: string;
  value: string;
}

export interface DetailsCardProps {
  items: DetailsCardItem[];
}
