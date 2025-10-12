import { useMemo } from "react";
import { LanguageService } from "@/services/language/LanguageService";
import { MedicineForms } from "@/constants/medicines";
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
 * Hook to get form options with memoization
 */
export const useFormOptions = (): SelectableListOption[] => {
  return useMemo(() => getFormOptions(), []);
};
