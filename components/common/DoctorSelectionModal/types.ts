import type { MyDoctorFromApi } from "@/types/doctors";

export interface DoctorSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectDoctor: (doctor: MyDoctorFromApi) => void;
}
