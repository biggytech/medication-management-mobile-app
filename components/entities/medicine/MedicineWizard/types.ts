import type { Medicine, MedicineData } from "@/types/medicines";

export interface MedicineWizardProps {
  initialData?: Partial<MedicineData>;
  onSubmit: (data: MedicineData) => Promise<void>;
  onCancel: () => void;
}
