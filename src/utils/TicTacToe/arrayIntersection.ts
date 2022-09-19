export const arrayIntersection = (arr1: number[], arr2: number[]) => {
  const union = arr1.filter((value) => arr2.includes(value));
  const disunion = arr1.filter((value) => !arr2.includes(value));
  return { union, disunion };
};
