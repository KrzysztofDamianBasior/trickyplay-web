import {
  CommentRepresentation,
  ReplyRepresentation,
  TPUserRepresentation,
} from "./ResourcesRepresentations";

export type DeleteAccountResponse = {
  message: string;
};

export type DeleteCommentResponse = {
  message: string;
};

export type DeleteReplyResponse = {
  message: string;
};

export type GetCommentsResponse = {
  totalElements: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
  isLast: boolean;
  comments: CommentRepresentation[];
};

export type GetRepliesResponse = {
  totalElements: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
  isLast: boolean;
  replies: ReplyRepresentation[];
};

export type GetUsersResponse = {
  totalElements: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
  isLast: boolean;
  users: TPUserRepresentation[];
};

export type RefreshAccessTokenResponse = {
  accessToken: string;
};

export type SignInResponse = {
  accessToken: string;
  refreshToken: string;
  userPublicInfo: TPUserRepresentation;
};

export type SignOutResponse = {
  numberOfRefreshTokensRemoved: number;
  message: string;
};
