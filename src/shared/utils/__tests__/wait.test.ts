import { wait } from "../wait";

describe("the wait function returns the correct values", () => {
  it("returns the value given as an argument", () => {
    expect.assertions(1);
    return expect(wait(1, 100)).resolves.toBe(1);
  });
});
