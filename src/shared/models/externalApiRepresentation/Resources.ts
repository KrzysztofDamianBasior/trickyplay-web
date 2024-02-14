export type TPUserRepresentation = {
  id: number;
  name: string;
  role: "USER" | "ADMIN" | "BANNED";
  createdAt: string; //ISO-8601 UTC
  updatedAt: string; //ISO-8601 UTC
};

export type CommentRepresentation = {
  id: number;
  body: string;
  gameName: string;
  author: TPUserRepresentation;
  createdAt: string; //ISO-8601 UTC
  updatedAt: string; //ISO-8601 UTC
};

export type ReplyRepresentation = {
  id: number;
  body: string;
  author: TPUserRepresentation;
  parentComment: CommentRepresentation;
  createdAt: string; //ISO-8601 UTC
  updatedAt: string; //ISO-8601 UTC
};
