import { LanguageService } from "@/services/language/LanguageService";
import { ddmmyyyyFromDate } from "@/utils/date";
import { hhmmFromDate } from "@/utils/date/hhmmFromDate";
import { isOverdue } from "@/utils/schedules/isOverdue";
import type { SchedulableEntity } from "@/types/common/schedules";

export const formatNextTakeDate = ({ schedule }: SchedulableEntity<string>) => {
  const { nextTakeDate } = schedule;

  if (!nextTakeDate) {
    return LanguageService.translate("Only as needed");
  }

  const nextTakeDateAsDate = new Date(nextTakeDate);

  if (
    isOverdue({
      schedule,
    })
  ) {
    return `${LanguageService.translate("Overdue")}: ${ddmmyyyyFromDate(nextTakeDateAsDate)} ${hhmmFromDate(nextTakeDateAsDate)}`;
  }
  // TODO: fix next dose text for trackers

  return `${LanguageService.translate("Next dose")}: ${ddmmyyyyFromDate(nextTakeDateAsDate)} ${hhmmFromDate(nextTakeDateAsDate)}`;
};
