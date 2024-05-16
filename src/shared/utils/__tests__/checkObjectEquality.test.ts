import { expect, describe, it } from "vitest";

import { checkObjectsEquality } from "../checkObjectsEquality";

describe("checkObjectEquality correctly compares variables of different types", () => {
  it("correctly compares objects", () => {
    expect(checkObjectsEquality({ a: 2, b: 3 }, { a: 2, b: 3 })).toBeTruthy();
    expect(checkObjectsEquality({ a: 2, b: 3 }, { a: 2 })).toBeFalsy();
  });
  it("correctly compares dates", () => {
    expect(
      checkObjectsEquality(new Date("2/1/22"), new Date("2/1/22"))
    ).toBeTruthy();
    expect(
      checkObjectsEquality(new Date("2/1/22"), new Date("2/1/23"))
    ).toBeFalsy();
  });
});
