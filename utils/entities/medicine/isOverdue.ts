import type { Schedule } from "@/types/common/schedules";

export const isOverdue = ({ schedule }: { schedule: Schedule<string> }) => {
  const { nextTakeDate } = schedule;

  if (!nextTakeDate) return false;

  const nextTakeDateAsDate = new Date(nextTakeDate);

  return nextTakeDateAsDate < new Date();
};
