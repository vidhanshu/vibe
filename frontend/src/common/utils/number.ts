export const getShortNumber = (number: number) => {
  if (number < 1000) return number;
  if (number < 1000000) return (number / 1000).toFixed(0) + "k";
  return (number / 1000000).toFixed(0) + "M";
};
