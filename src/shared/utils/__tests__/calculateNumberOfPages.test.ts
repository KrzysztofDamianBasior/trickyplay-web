import { expect, describe, it } from "vitest";

import { calculateNumberOfPages } from "../calculateNumberOfPages";

describe("calculateNumberOfPages returns correct values", () => {
  it("correctly calculates the number of pages for both even arguments", () => {
    expect(
      calculateNumberOfPages({ perPage: 8, totalNumberOfEntities: 16 })
    ).toEqual(2);
  });
  it("correctly calculates the number of pages when at least one of the arguments is odd", () => {
    expect(
      calculateNumberOfPages({ perPage: 8, totalNumberOfEntities: 17 })
    ).toEqual(3);
    expect(
      calculateNumberOfPages({ perPage: 7, totalNumberOfEntities: 17 })
    ).toEqual(3);
    expect(
      calculateNumberOfPages({ perPage: 13, totalNumberOfEntities: 16 })
    ).toEqual(2);
  });
});
