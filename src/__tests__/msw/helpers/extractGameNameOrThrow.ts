import { HttpResponse } from "msw";
import generateErrorResponseBody from "./generateErrorResponseBody";

export function extractGameName(url: URL) {
  if (
    /^(Snake|TicTacToe|Minesweeper)$/.test(
      url.searchParams.get("gameName") as string
    )
  ) {
    return url.searchParams.get("gameName") as
      | "Snake"
      | "TicTacToe"
      | "Minesweeper";
  } else {
    throw HttpResponse.json(
      generateErrorResponseBody("Bad Request", url.pathname, "invalid gameName")
    );
  }
}
