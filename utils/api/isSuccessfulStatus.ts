export const isSuccessfulStatus = (response: Response): boolean => {
  return Math.floor(response.status / 100) === 2;
};
