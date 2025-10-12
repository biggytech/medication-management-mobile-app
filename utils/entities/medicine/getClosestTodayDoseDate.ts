import { getDateWithTime } from "@/utils/date/getDateWithTime";
import { isNotNullish } from "@/utils/types/isNotNullish";
import type { Schedule } from "@/types/common/schedules";

export const getClosestTodayDoseDate = (
  schedule: Schedule<Date> | Schedule<string>,
  fromDate: Date,
): Date | null => {
  const { notificationTimes } = schedule;
  const notificationTimesSorted = [...notificationTimes].sort();
  const todayDosesEpochs = notificationTimesSorted
    .map((time) => getDateWithTime(new Date(), time))
    .filter(isNotNullish)
    .map((date) => date.valueOf());

  const closestDoseDateEpoch = todayDosesEpochs.find(
    (epoch) => epoch > fromDate.valueOf(),
  );

  if (closestDoseDateEpoch) {
    return new Date(closestDoseDateEpoch);
  }

  return null;
};
