import { expect, describe, it } from "vitest";

import { mapResponseErrorToMessage } from "../mapResponseErrorToMessage";
import { AxiosError } from "axios";

describe("mapToResponseErrorMessage returns correct messages", () => {
  it("returns correct messages", () => {
    expect(mapResponseErrorToMessage(new AxiosError("", "400"))).toEqual(
      "Bad request"
    );
    expect(mapResponseErrorToMessage(new AxiosError("", "401"))).toEqual(
      "Unauthenticated"
    );
    expect(mapResponseErrorToMessage(new AxiosError("", "404"))).toEqual(
      "Not found"
    );
    expect(mapResponseErrorToMessage(new AxiosError("", "403"))).toEqual(
      "Lack of sufficient permissions"
    );
    expect(mapResponseErrorToMessage(new AxiosError("", "500"))).toEqual(
      "Internal server error"
    );
    expect(mapResponseErrorToMessage(new AxiosError("", "0"))).toEqual(
      "Request failed"
    );
  });
});
