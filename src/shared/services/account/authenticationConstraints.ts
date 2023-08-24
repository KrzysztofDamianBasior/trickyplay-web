const maxNumOfUsernameLetters: number = process.env
  .REACT_APP_MAX_NUM_OF_USERNAME_LETTERS
  ? parseInt(process.env.REACT_APP_MAX_NUM_OF_USERNAME_LETTERS)
  : 16;

const minNumOfUsernameLetters: number = process.env
  .REACT_APP_MIN_NUM_OF_USERNAME_LETTERS
  ? parseInt(process.env.REACT_APP_MIN_NUM_OF_USERNAME_LETTERS)
  : 2;

const maxNumOfPasswordLetters: number = process.env
  .REACT_APP_MAX_NUM_OF_PASSWORD_LETTERS
  ? parseInt(process.env.REACT_APP_MAX_NUM_OF_PASSWORD_LETTERS)
  : 32;

const minNumOfPasswordLetters: number = process.env
  .REACT_APP_MIN_NUM_OF_PASSWORD_LETTERS
  ? parseInt(process.env.REACT_APP_MIN_NUM_OF_PASSWORD_LETTERS)
  : 4;

const usernamePatternExpression = `^[a-zA-Z0-9_]{${minNumOfUsernameLetters}},${maxNumOfUsernameLetters}}$`;
export const USERNAME_REGEX = new RegExp(usernamePatternExpression); // /^[a-zA-Z0-9_]{2,16}$/

const passwordPatternExpression = `^(?=.*[0-9])[a-zA-Z0-9_]{${minNumOfPasswordLetters},${maxNumOfPasswordLetters}}$`;
export const PASSWORD_REGEX = new RegExp(passwordPatternExpression); // /^(?=.*[0-9])[a-zA-Z0-9_]{4,32}$/;

export const USERNAME_MESSAGE = `Username must contain between ${minNumOfUsernameLetters} and ${maxNumOfUsernameLetters} characters. It can only consist of underscores, numbers, lowercase and uppercase letters.`;

export const PASSWORD_MESSAGE = `Password must contain between ${minNumOfPasswordLetters} and ${maxNumOfPasswordLetters} characters. It must contain at least one number. The password can only consist of underscores, numbers, lowercase and uppercase letters.`;
