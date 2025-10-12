import { LanguageService } from "@/services/language/LanguageService";
import { hhmmFromDate } from "@/utils/date/hhmmFromDate";
import { isOverdue } from "@/utils/schedules/isOverdue";
import { ddmmyyyyFromDate } from "@/utils/date";
import type { SchedulableEntity } from "@/types/common/schedules";

export const formatNextTakeDateShort = ({
  schedule,
}: SchedulableEntity<string>) => {
  const { nextTakeDate } = schedule;

  if (!nextTakeDate) {
    return LanguageService.translate("Only as needed");
  }

  const nextTakeDateAsDate = new Date(nextTakeDate);

  if (isOverdue({ schedule })) {
    const dueDateString = ddmmyyyyFromDate(nextTakeDateAsDate);
    const todayDateString = ddmmyyyyFromDate(new Date());

    if (dueDateString === todayDateString) {
      // show time only
      return `${LanguageService.translate("Overdue")}: ${hhmmFromDate(nextTakeDateAsDate)}`;
    }

    // show full overdue date
    return `${LanguageService.translate("Overdue")}: ${ddmmyyyyFromDate(nextTakeDateAsDate)} ${hhmmFromDate(nextTakeDateAsDate)}`;
  }

  // TODO: fix next dose text for trackers
  return `${LanguageService.translate("Next dose")}: ${hhmmFromDate(nextTakeDateAsDate)}`;
};
