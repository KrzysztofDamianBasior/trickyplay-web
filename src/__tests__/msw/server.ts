import { setupServer } from "msw/node";
import { handlers as commentsHandlers } from "./handlers/comments";
import { handlers as repliesHandlers } from "./handlers/replies";
import { handlers as usersHandlers } from "./handlers/users";
import { handlers as authHandlers } from "./handlers/auth";
import { handlers as accountHandlers } from "./handlers/account";

// In line with the success behavior-first strategy, the basic handles describing the correct network behavior (happy paths o the network) are defined below
// Utilize network behavior overrides to split the behavior of the same resource between its happy state and its on-demand states whenever you need them.
export const server = setupServer(
  ...commentsHandlers,
  ...repliesHandlers,
  ...usersHandlers,
  ...authHandlers,
  ...accountHandlers
);
