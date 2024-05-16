import { expect, describe, it } from "vitest";

import { arraysIntersection } from "../arraysIntersection";

describe("arrayIntersection returns correct values", () => {
  it("intersects arrays of numbers correctly", () => {
    const { union, disunion } = arraysIntersection(
      [1, 2, 3, 4, 5],
      [4, 5, 6, 7]
    );
    expect(union).toEqual([4, 5]);
    expect(disunion).toEqual([1, 2, 3]);
  });
});
