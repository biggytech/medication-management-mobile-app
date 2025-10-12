import { isOverdue } from "@/utils/schedules/isOverdue";
import { isDueToday } from "@/utils/schedules/isDueToday";
import type { SchedulableEntity } from "@/types/common/schedules";

export const isDueOrOverdueToday = (entity: SchedulableEntity<string>) => {
  return isDueToday(entity) || isOverdue(entity);
};
