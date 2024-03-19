import { getEnvironmentVariable } from "../../shared/utils";

export const getSingleCommentPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_COMMENTS_URL") +
  "/" +
  ":id";
export const getCommentsFeedPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_COMMENTS_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_COMMENTS_FEED_ENDPOINT");
export const addCommentPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_COMMENTS_URL");
export const patchCommentPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_COMMENTS_URL") +
  "/" +
  ":id";
export const deleteCommentPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_COMMENTS_URL") +
  "/" +
  ":id";

export const getSingleReplyPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_REPLIES_URL") +
  "/" +
  ":id";
export const getRepliesFeedPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_REPLIES_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_REPLIES_FEED_ENDPOINT");
export const addReplyPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_REPLIES_URL");
export const patchReplyPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_REPLIES_URL") +
  "/" +
  ":id";
export const deleteReplyPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_REPLIES_URL") +
  "/" +
  ":id";

export const getSingleUserPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_USERS_URL") +
  "/" +
  ":id";
export const getUsersFeedPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_USERS_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_USERS_FEED_ENDPOINT");
export const getUserCommentsPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_USERS_URL") +
  "/" +
  ":id" +
  "/" +
  getEnvironmentVariable("REACT_APP_USER_COMMENTS_ENDPOINT");
export const getUserRepliesPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_USERS_URL") +
  "/" +
  ":id" +
  "/" +
  getEnvironmentVariable("REACT_APP_USER_REPLIES_ENDPOINT");
export const getUserActivitySummaryPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_USERS_URL") +
  "/" +
  ":id" +
  "/" +
  getEnvironmentVariable("REACT_APP_USER_ACCTIVITY_SUMMARY_ENDPOINT");
export const banUserPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_USERS_URL") +
  "/" +
  ":id" +
  "/" +
  getEnvironmentVariable("REACT_APP_BAN_ENDPOINT");
export const unbanUserPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_USERS_URL") +
  "/" +
  ":id" +
  "/" +
  getEnvironmentVariable("REACT_APP_UNBAN_ENDPOINT");
export const grantAdminPermissionsPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_USERS_URL") +
  "/" +
  ":id" +
  "/" +
  getEnvironmentVariable("REACT_APP_GRANT_ADMIN_PERMISSIONS_ENDPOINT");

export const refreshAccessTokenPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_AUTH_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_REFRESH_ACCESS_TOKEN_ENDPOINT");
export const signInPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_AUTH_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_SIGN_IN_ENDPOINT");
export const signUpPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_AUTH_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_SIGN_UP_ENDPOINT");
export const singleSessionSignOutPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_AUTH_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_SINGLE_SESSION_SIGN_OUT_ENDPOINT");
export const allSessionsSignOutPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_AUTH_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_ALL_SESSIONS_SIGN_OUT_ENDPOINT");

export const getActivitySummaryPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_ACCOUNT_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_ACCOUNT_ACTIVITY_SUMMARY_ENDPOINT");
export const getAccountPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_ACCOUNT_URL");
export const patchAccountPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_ACCOUNT_URL");
export const deleteAccountPath =
  getEnvironmentVariable("REACT_APP_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("REACT_APP_ACCOUNT_URL");
