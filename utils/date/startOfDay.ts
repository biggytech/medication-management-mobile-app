export const startOfDay = (date: Date) => {
  const dateCopy = new Date(date.valueOf());

  dateCopy.setHours(0);
  dateCopy.setMinutes(0);
  dateCopy.setSeconds(0);
  dateCopy.setMilliseconds(0);

  return dateCopy;
};
