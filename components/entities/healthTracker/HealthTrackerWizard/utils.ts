import { useMemo } from "react";
import { LanguageService } from "@/services/language/LanguageService";
import { HEALTH_TRACKER_TYPE_OPTIONS } from "@/constants/healthTrackers";
import type { SelectableListOption } from "@/components/common/inputs/SelectableList/types";

/**
 * Get health tracker type options for selection
 */
export const getHealthTrackerTypeOptions = (): SelectableListOption[] => {
  return HEALTH_TRACKER_TYPE_OPTIONS.map((option) => ({
    title: LanguageService.translate(option.label),
    id: option.id,
    description: LanguageService.translate(option.description),
    icon: option.icon,
  }));
};

/**
 * Hook to get health tracker type options with memoization
 */
export const useHealthTrackerTypeOptions = (): SelectableListOption[] => {
  return useMemo(() => getHealthTrackerTypeOptions(), []);
};
