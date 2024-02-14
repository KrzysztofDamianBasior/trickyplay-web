export type ErrorResponseBodyType = {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
};

export type Unauthorized401ResponseType = ErrorResponseBodyType & {
  status: 401;
  error: "Unauthorized";
};

export type NotFound404ResponseType = ErrorResponseBodyType & {
  status: 404;
  error: "Not Found";
};

export type InternalServerError500ResponseType = ErrorResponseBodyType & {
  status: 500;
  error: "Internal Server Error";
};

export type Forbidden403ResponseType = ErrorResponseBodyType & {
  status: 403;
  error: "Forbidden";
};

export type BadRequest400ResponseType = ErrorResponseBodyType & {
  status: 400;
  error: "Bad Request";
};

// export type ErrorResponeType =
//   | Unauthorized401ResponseType
//   | NotFound404ResponseType
//   | InternalServerError500ResponseType
//   | Forbidden403ResponseType
//   | BadRequest400ResponseType;

// export type ErrorName =
//   | "Unauthorized"
//   | "NotFound"
//   | "Internal Server Error"
//   | "Forbidden"
//   | "Bad Request";

// export type ErrorResponseType<T> = T extends "Unauthorized"
//   ? Unauthorized401Type
//   : T extends "Not Found"
//   ? NotFound404Type
//   : T extends "Internal Server Error"
//   ? InternalServerError500Type
//   : T extends "Forbidden"
//   ? Forbidden403Type
//   : T extends "Bad Request"
//   ? BadRequest400Type
//   : never;

// helper type to convert from the string to the object
// export type AtoB<A, B> = B extends { error: infer V }
//   ? V extends A
//     ? B
//     : never
//   : never;
