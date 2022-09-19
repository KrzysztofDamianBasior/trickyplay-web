/**
 * Find a random integer between min and max, the maximum is exclusive and the minimum is inclusive
 * @param min
 * @param max
 * @returns random integer
 */
export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};
