import { expect, describe, test } from "vitest";
import {
  PASSWORD_MESSAGE,
  PASSWORD_REGEX,
  USERNAME_MESSAGE,
  USERNAME_REGEX,
} from "../authenticationConstraints";

describe("use of authentication constraints", () => {
  test("correctness of regular expressions and messages", () => {
    // Set the variables
    import.meta.env.VITE_MIN_NUM_OF_COMMENT_LETTERS = "1";
    import.meta.env.VITE_MAX_NUM_OF_COMMENT_LETTERS = "300";

    import.meta.env.VITE_MIN_NUM_OF_PASSWORD_LETTERS = "4";
    import.meta.env.VITE_MAX_NUM_OF_PASSWORD_LETTERS = "32";

    import.meta.env.VITE_MIN_NUM_OF_USERNAME_LETTERS = "2";
    import.meta.env.VITE_MAX_NUM_OF_USERNAME_LETTERS = "16";

    const validUsername = "bananaMonkey";
    const validPassword = "m0nkeysPa22w0rd";
    const invalidUsername = "1";
    const invalidPassword = "@";

    expect(USERNAME_MESSAGE).toEqual(
      `Username must contain between ${
        import.meta.env.VITE_MIN_NUM_OF_USERNAME_LETTERS
      } and ${
        import.meta.env.VITE_MAX_NUM_OF_USERNAME_LETTERS
      } characters. It can only consist of underscores, numbers, lowercase and uppercase letters.`
    );
    expect(PASSWORD_MESSAGE).toEqual(
      `Password must contain between ${
        import.meta.env.VITE_MIN_NUM_OF_PASSWORD_LETTERS
      } and ${
        import.meta.env.VITE_MAX_NUM_OF_PASSWORD_LETTERS
      } characters. It must contain at least one number. The password can only consist of underscores, numbers, lowercase and uppercase letters.`
    );

    expect(USERNAME_REGEX.test(validUsername)).toBeTruthy();
    expect(USERNAME_REGEX.test(invalidUsername)).toBeFalsy();
    expect(PASSWORD_REGEX.test(validPassword)).toBeTruthy();
    expect(PASSWORD_REGEX.test(invalidPassword)).toBeFalsy();
  });
});
