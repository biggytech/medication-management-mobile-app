import { LanguageService } from "@/services/language/LanguageService";
import { ddmmyyyyFromDate } from "@/utils/date";
import { hhmmFromDate } from "@/utils/date/hhmmFromDate";
import { isOverdue } from "@/utils/entities/medicine/isOverdue";
import type { Schedule } from "@/types/common/schedules";

export const formatNextTakeDate = ({
  schedule,
}: {
  schedule: Schedule<string>;
}) => {
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

  return `${LanguageService.translate("Next dose")}: ${ddmmyyyyFromDate(nextTakeDateAsDate)} ${hhmmFromDate(nextTakeDateAsDate)}`;
};
