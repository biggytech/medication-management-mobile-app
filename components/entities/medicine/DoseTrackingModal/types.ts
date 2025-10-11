import type { MedicineFromApi } from "@/types/medicines";

export interface DoseTrackingModalProps {
  medicine: MedicineFromApi;
  onClose: () => void;
}
