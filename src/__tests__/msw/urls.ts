import { getEnvironmentVariable } from "../../shared/utils";

export const getSingleCommentPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_COMMENTS_URL") +
  "/" +
  ":id";
export const getCommentsFeedPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_COMMENTS_URL") +
  "/" +
  getEnvironmentVariable("VITE_COMMENTS_FEED_ENDPOINT");
export const addCommentPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_COMMENTS_URL");
export const patchCommentPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_COMMENTS_URL") +
  "/" +
  ":id";
export const deleteCommentPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_COMMENTS_URL") +
  "/" +
  ":id";

export const getSingleReplyPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_REPLIES_URL") +
  "/" +
  ":id";
export const getRepliesFeedPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_REPLIES_URL") +
  "/" +
  getEnvironmentVariable("VITE_REPLIES_FEED_ENDPOINT");
export const addReplyPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_REPLIES_URL");
export const patchReplyPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_REPLIES_URL") +
  "/" +
  ":id";
export const deleteReplyPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_REPLIES_URL") +
  "/" +
  ":id";

export const getSingleUserPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_USERS_URL") +
  "/" +
  ":id";
export const getUsersFeedPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_USERS_URL") +
  "/" +
  getEnvironmentVariable("VITE_USERS_FEED_ENDPOINT");
export const getUserCommentsPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_USERS_URL") +
  "/" +
  ":id" +
  "/" +
  getEnvironmentVariable("VITE_USER_COMMENTS_ENDPOINT");
export const getUserRepliesPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_USERS_URL") +
  "/" +
  ":id" +
  "/" +
  getEnvironmentVariable("VITE_USER_REPLIES_ENDPOINT");
export const getUserActivitySummaryPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_USERS_URL") +
  "/" +
  ":id" +
  "/" +
  getEnvironmentVariable("VITE_USER_ACCTIVITY_SUMMARY_ENDPOINT");
export const banUserPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_USERS_URL") +
  "/" +
  ":id" +
  "/" +
  getEnvironmentVariable("VITE_BAN_ENDPOINT");
export const unbanUserPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_USERS_URL") +
  "/" +
  ":id" +
  "/" +
  getEnvironmentVariable("VITE_UNBAN_ENDPOINT");
export const grantAdminPermissionsPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_USERS_URL") +
  "/" +
  ":id" +
  "/" +
  getEnvironmentVariable("VITE_GRANT_ADMIN_PERMISSIONS_ENDPOINT");

export const refreshAccessTokenPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_AUTH_URL") +
  "/" +
  getEnvironmentVariable("VITE_REFRESH_ACCESS_TOKEN_ENDPOINT");
export const signInPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_AUTH_URL") +
  "/" +
  getEnvironmentVariable("VITE_SIGN_IN_ENDPOINT");
export const signUpPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_AUTH_URL") +
  "/" +
  getEnvironmentVariable("VITE_SIGN_UP_ENDPOINT");
export const singleSessionSignOutPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_AUTH_URL") +
  "/" +
  getEnvironmentVariable("VITE_SINGLE_SESSION_SIGN_OUT_ENDPOINT");
export const allSessionsSignOutPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_AUTH_URL") +
  "/" +
  getEnvironmentVariable("VITE_ALL_SESSIONS_SIGN_OUT_ENDPOINT");

export const getActivitySummaryPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_ACCOUNT_URL") +
  "/" +
  getEnvironmentVariable("VITE_ACCOUNT_ACTIVITY_SUMMARY_ENDPOINT");
export const getAccountPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_ACCOUNT_URL");
export const patchAccountPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_ACCOUNT_URL");
export const deleteAccountPath =
  getEnvironmentVariable("VITE_TRICKYPLAY_API_BASE_URL") +
  "/" +
  getEnvironmentVariable("VITE_ACCOUNT_URL");
