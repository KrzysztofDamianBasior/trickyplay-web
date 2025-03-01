/* eslint-disable prefer-const */
import { ReplyRepresentation } from "../../../shared/models/externalApiRepresentation/Resources";

import { commentsCollectionStub } from "./comments";
import { userStub, adminStub, bannedStub } from "./users";

export const userRepliesCollectionStub: ReplyRepresentation[] = [
  {
    parentComment: commentsCollectionStub[0],
    author: userStub,
    body: "user reply to first comment",
    id: 1,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
  {
    parentComment: commentsCollectionStub[2],
    author: userStub,
    body: "user reply to third comment",
    id: 2,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
  {
    parentComment: commentsCollectionStub[4],
    author: userStub,
    body: "user reply to fifth comment",
    id: 3,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
];

export const adminRepliesCollectionStub: ReplyRepresentation[] = [
  {
    parentComment: commentsCollectionStub[0],
    author: adminStub,
    body: "admin reply to first comment",
    id: 4,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
  {
    parentComment: commentsCollectionStub[2],
    author: adminStub,
    body: "admin reply to third comment",
    id: 5,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
  {
    parentComment: commentsCollectionStub[4],
    author: adminStub,
    body: "admin reply to fifth comment",
    id: 6,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
];

export const bannedRepliesCollectionStub: ReplyRepresentation[] = [
  {
    parentComment: commentsCollectionStub[0],
    author: bannedStub,
    body: "banned reply to first comment",
    id: 7,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
  {
    parentComment: commentsCollectionStub[2],
    author: bannedStub,
    body: "banned reply to third comment",
    id: 8,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
  {
    parentComment: commentsCollectionStub[4],
    author: bannedStub,
    body: "banned reply to fifth comment",
    id: 9,
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
  },
];

export let repliesCollectionStub: ReplyRepresentation[] = [
  ...userRepliesCollectionStub,
  ...adminRepliesCollectionStub,
  ...bannedRepliesCollectionStub,
];

let repliesCollectionStubCopy: ReplyRepresentation[] = JSON.parse(
  JSON.stringify(repliesCollectionStub)
);

export const resetRepliesCollectionStub = () => {
  repliesCollectionStub.length = 0; // This will clear the existing array by setting its length to 0
  repliesCollectionStub.push(...repliesCollectionStubCopy);
  repliesCollectionStubCopy = JSON.parse(JSON.stringify(repliesCollectionStub));
};
