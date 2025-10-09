export const endOfDay = (date: Date) => {
  const dateCopy = new Date(date.valueOf());

  dateCopy.setHours(23);
  dateCopy.setMinutes(59);
  dateCopy.setSeconds(59);
  dateCopy.setMilliseconds(999);

  return dateCopy;
};
