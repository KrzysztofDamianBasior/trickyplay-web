/**
 * Determines an intersection between two arrays
 * @param arr1 first array
 * @param arr2 second array
 * @returns union and disunion
 */
export const arraysIntersection = (arr1: number[], arr2: number[]) => {
  const union = arr1.filter((value) => arr2.includes(value));
  const disunion = arr1.filter((value) => !arr2.includes(value));
  return { union, disunion };
};
