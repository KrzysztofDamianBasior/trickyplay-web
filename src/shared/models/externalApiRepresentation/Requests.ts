export type AddCommentRequest = {
  /**
   * Comment body
   *
   * Constraints: not null, the minimum number of characters is 1, the maximum number of characters is 300
   */
  body: string;

  /**
   * Name of the game under which the comment appears
   *
   * Constraints: takes one of the values 'Snake' or 'TicTacToe' or 'Minesweeper'
   */
  gameName: string;
};

export type AddReplyRequest = {
  /**
   * Reply body
   *
   * Constraints: not null, the minimum number of characters is 1, the maximum number of characters is 300
   */
  body: string;

  /**
   * Id of the comment under which the reply appears
   *
   * Constraints: not null, the minimal value is 0
   */
  parentCommentId: number;
};

export type PatchCommentRequest = {
  /**
   * New comment content
   *
   * Constraints: not null, the minimum number of characters is 1, the maximum number of characters is 300
   */
  newCommentBody: string;
};

export type PatchReplyRequest = {
  /**
   * New body of reply
   *
   * Constraints: not null, the minimum number of characters is 1, the maximum number of characters is 300
   */
  newReplyBody: string;
};

export type RefreshAccessTokenRequest = {
  /**
   * Token required to authenticate the user in order to generate a new access token
   *
   * Constraints: can't be an empty string
   */
  refreshToken: string;
};

export type SingleSessionSignOutRequest = {
  /**
   * Token related to the session we request to be deleted
   *
   * Constraints: can't be an empty string
   */
  refreshToken: string;
};

export type SignInRequest = {
  /**
   * The name under which the user will be visible when commenting and replying to comments
   *
   * Constraints: the minimum number of characters is 2, the maximum number of characters is 16,
   * it can only consist of underscores, numbers, lowercase and uppercase letters,
   * not null
   */
  username: string;

  /**
   * Password necessary to confirm the user's identity
   *
   * Constraints: the minimum number of characters is 4, the maximum number of characters is 32,
   * password must contain between 4 and 32 characters.
   * it must contain at least one number,
   * it can only consist of underscores, numbers, lowercase and uppercase letters,
   * not null
   */
  password: string;
};

export type SignUpRequest = {
  /**
   * The name under which the user will be visible when commenting and replying to comments
   *
   * Constraints: the minimum number of characters is 2, the maximum number of characters is 16,
   * it can only consist of underscores, numbers, lowercase and uppercase letters,
   * not null
   */
  username: string;

  /**
   * Password necessary to confirm the user's identity
   *
   * Constraints: the minimum number of characters is 4, the maximum number of characters is 32,
   * password must contain between 4 and 32 characters.
   * it must contain at least one number,
   * it can only consist of underscores, numbers, lowercase and uppercase letters,
   * not null
   */
  password: string;
};

export type PatchAccountRequest = {
  /**
   * New username under which the user will be visible when commenting and replying to comments
   *
   * Constraints: the minimum number of characters is 2, the maximum number of characters is 16,
   * it can only consist of underscores, numbers, lowercase and uppercase letters,
   * can be null
   */
  newUsername: string | null;

  /**
   * New password necessary to confirm the user's identity
   *
   * Constraints: the minimum number of characters is 4, the maximum number of characters is 32,
   * password must contain between 4 and 32 characters.
   * it must contain at least one number,
   * it can only consist of underscores, numbers, lowercase and uppercase letters,
   * can be null
   */
  newPassword: string | null;
};
