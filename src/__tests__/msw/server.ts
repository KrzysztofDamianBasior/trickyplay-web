import { setupServer } from "msw/node";
import {
  handlers as commentsHandlers,
  internalServerErrorHandlers as commentsInternalServerErrorHandlers,
} from "./handlers/comments";
import {
  handlers as repliesHandlers,
  internalServerErrorHandlers as repliesInternalServerErrorHandlers,
} from "./handlers/replies";
import {
  handlers as usersHandlers,
  internalServerErrorHandlers as usersInternalServerErrorHandlers,
} from "./handlers/users";
import {
  handlers as authHandlers,
  internalServerErrorHandlers as authInternalServerErrorHandlers,
} from "./handlers/auth";
import {
  handlers as accountHandlers,
  internalServerErrorHandlers as accountInternalServerErrorHandlers,
} from "./handlers/account";

export const handlers = [
  ...commentsHandlers,
  ...repliesHandlers,
  ...usersHandlers,
  ...authHandlers,
  ...accountHandlers,
];

export const internalServerErrorHandlers = [
  ...commentsInternalServerErrorHandlers,
  ...repliesInternalServerErrorHandlers,
  ...usersInternalServerErrorHandlers,
  ...authInternalServerErrorHandlers,
  ...accountInternalServerErrorHandlers,
];

// In line with the success behavior-first strategy, the basic handles describing the correct network behavior (happy paths o the network) are defined below
// Utilize network behavior overrides to split the behavior of the same resource between its happy state and its on-demand states whenever you need them.
export const server = setupServer(...handlers);

server.events.on("request:start", ({ request }) => {
  console.log("Outgoing:", request.method, request.url);
});
