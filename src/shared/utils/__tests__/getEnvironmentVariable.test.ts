import { expect, describe, test } from "vitest";

import { getEnvironmentVariable } from "../getEnvironmentVariable";

describe("describes whether a getEnvironmentVariable function returns correct results", () => {
  test("will return correct values", () => {
    // Set the variables
    import.meta.env.VITE_AUTH_URL = "/auth";

    expect(getEnvironmentVariable("VITE_AUTH_URL")).toEqual("/auth");
  });

  test("will behave appropriately in the absence of the requested variable", () => {
    // Set the variables
    expect(() => getEnvironmentVariable("asdf")).toThrowError(
      new Error("missing env var for asdf")
    );
  });
});
