import type { DoctorFromApi } from "@/types/doctors";

export interface DoctorSearchBarProps {
  onDoctorSelect?: (doctor: DoctorFromApi) => void;
  placeholder?: string;
}

export interface DoctorSearchResultProps {
  doctor: DoctorFromApi;
  onPress: () => void;
}
