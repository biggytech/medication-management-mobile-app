import type { MedicineFromApi } from "@/types/medicines";

export interface MedicineListItemProps {
  medicine: MedicineFromApi;
  onPress: (id: MedicineFromApi["id"]) => void;
  shortDoseDate?: boolean;
  alwaysShowDates?: boolean;
  isPressable?: boolean;
}
