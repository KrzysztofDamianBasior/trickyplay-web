import { getRandomInt } from "../getRandomInt";

describe("describes whether a getRandomInt function produces results that meet expected requirements", () => {
  it("checks whether the drawn number is in the appropriate range", () => {
    expect(getRandomInt(1, 10)).toBeGreaterThanOrEqual(1);
    expect(getRandomInt(1, 10)).toBeLessThan(10);
  });
});
