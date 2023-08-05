export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,23}$/;

export const PASSWORD_REGEX = /^(?=.*[0-9])[a-zA-Z0-9_]{5,24}$/;

export const USERNAME_MESSAGE =
  "Username must contain between 3 and 23 characters. It can only consist of underscores, numbers, lowercase and uppercase letters.";

export const PASSWORD_MESSAGE =
  "Password must contain between 5 and 24 characters. It must contain at least one number. The password can only consist of underscores, numbers, lowercase and uppercase letters.";
