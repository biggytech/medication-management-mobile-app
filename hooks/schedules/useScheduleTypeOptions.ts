import type { SelectableListOption } from "@/components/common/inputs/SelectableList/types";
import { getScheduleTypeOptions } from "@/utils/schedules/getScheduleTypeOptions";
import { useMemo } from "react";

/**
 * Hook to get schedule type options with memoization
 */
export const useScheduleTypeOptions = (): SelectableListOption[] => {
  return useMemo(() => getScheduleTypeOptions(), []);
};
