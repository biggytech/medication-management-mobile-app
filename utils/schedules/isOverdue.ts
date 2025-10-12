import type { SchedulableEntity } from "@/types/common/schedules";

export const isOverdue = ({ schedule }: SchedulableEntity<string>) => {
  const { nextTakeDate } = schedule;

  if (!nextTakeDate) return false;

  const nextTakeDateAsDate = new Date(nextTakeDate);

  return nextTakeDateAsDate < new Date();
};
