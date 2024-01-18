import { getEnvironmentVariable } from "../../utils";

const maxNumOfUsernameLetters: number = parseInt(
  getEnvironmentVariable("REACT_APP_MAX_NUM_OF_USERNAME_LETTERS")
);

const minNumOfUsernameLetters: number = parseInt(
  getEnvironmentVariable("REACT_APP_MIN_NUM_OF_USERNAME_LETTERS")
);

const maxNumOfPasswordLetters: number = parseInt(
  getEnvironmentVariable("REACT_APP_MAX_NUM_OF_PASSWORD_LETTERS")
);

const minNumOfPasswordLetters: number = parseInt(
  getEnvironmentVariable("REACT_APP_MIN_NUM_OF_PASSWORD_LETTERS")
);

const usernamePatternExpression = `^[a-zA-Z0-9_]{${minNumOfUsernameLetters}},${maxNumOfUsernameLetters}}$`;
export const USERNAME_REGEX = new RegExp(usernamePatternExpression); // /^[a-zA-Z0-9_]{2,16}$/

const passwordPatternExpression = `^(?=.*[0-9])[a-zA-Z0-9_]{${minNumOfPasswordLetters},${maxNumOfPasswordLetters}}$`;
export const PASSWORD_REGEX = new RegExp(passwordPatternExpression); // /^(?=.*[0-9])[a-zA-Z0-9_]{4,32}$/;

export const USERNAME_MESSAGE = `Username must contain between ${minNumOfUsernameLetters} and ${maxNumOfUsernameLetters} characters. It can only consist of underscores, numbers, lowercase and uppercase letters.`;

export const PASSWORD_MESSAGE = `Password must contain between ${minNumOfPasswordLetters} and ${maxNumOfPasswordLetters} characters. It must contain at least one number. The password can only consist of underscores, numbers, lowercase and uppercase letters.`;
