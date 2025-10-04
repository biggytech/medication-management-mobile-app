import { useMemo } from "react";
import { LanguageService } from "@/services/language/LanguageService";
import {
  MedicineForms,
  MedicineScheduleTypes,
  MEDICINE_SCHEDULE_TYPE_LABELS,
} from "@/constants/medicines";
import type { SelectableListOption } from "@/components/common/inputs/SelectableList/types";

/**
 * Get form options for medicine form selection
 */
export const getFormOptions = (): SelectableListOption[] => {
  return Object.values(MedicineForms).map((value) => ({
    title: LanguageService.translate(value),
    id: value,
  }));
};

/**
 * Get schedule type options for medicine schedule selection
 */
export const getScheduleTypeOptions = (): SelectableListOption[] => {
  return Object.values(MedicineScheduleTypes).map((value) => ({
    title: LanguageService.translate(MEDICINE_SCHEDULE_TYPE_LABELS[value]),
    id: value,
  }));
};

/**
 * Hook to get form options with memoization
 */
export const useFormOptions = (): SelectableListOption[] => {
  return useMemo(() => getFormOptions(), []);
};

/**
 * Hook to get schedule type options with memoization
 */
export const useScheduleTypeOptions = (): SelectableListOption[] => {
  return useMemo(() => getScheduleTypeOptions(), []);
};
