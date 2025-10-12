import { SCHEDULE_TYPE_LABELS, ScheduleTypes } from "@/constants/schedules";
import { LanguageService } from "@/services/language/LanguageService";
import type { SelectableListOption } from "@/components/common/inputs/SelectableList/types";

/**
 * Get schedule type options for schedule selection
 */
export const getScheduleTypeOptions = (): SelectableListOption[] => {
  return Object.values(ScheduleTypes).map((value) => ({
    title: LanguageService.translate(SCHEDULE_TYPE_LABELS[value]),
    id: value,
  }));
};
