export const splitArray = <T>(a: T[], k: number = 3) => {
  const newArr = [];
  for (let i = 0; i < a.length; i += k) {
    newArr.push(a.slice(i, i + k));
  }
  return newArr;
};
