import { getEnvironmentVariable } from "../getEnvironmentVariable";

describe("describes whether a getEnvironmentVariable function returns correct results", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  test("will return correct values", () => {
    // Set the variables
    process.env.REACT_APP_AUTH_URL = "/auth";

    expect(getEnvironmentVariable("REACT_APP_AUTH_URL")).toEqual("/auth");
  });

  test("will behave appropriately in the absence of the requested variable", () => {
    // Set the variables
    expect(getEnvironmentVariable("asdf")).toThrowError(
      new Error("missing env var for asdf")
    );
  });
});
