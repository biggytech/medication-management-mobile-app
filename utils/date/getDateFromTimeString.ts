// Convert string time to Date object
export const getDateFromTimeString = (timeString: string | null): Date => {
  if (!timeString) {
    return new Date();
  }
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};
