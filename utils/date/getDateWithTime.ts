export const getDateWithTime = (date: Date, time: string): Date => {
  const [hours, minutes] = time.split(":").map(Number);
  date.setHours(hours, minutes, 0, 0);
  return date;
};
