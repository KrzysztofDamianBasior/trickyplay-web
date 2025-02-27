import { expect, describe, it } from "vitest";

import { mapResponseErrorToMessage } from "../mapResponseErrorToMessage";
import { AxiosError, AxiosHeaders } from "axios";

describe("mapToResponseErrorMessage returns correct messages", () => {
  it("returns correct messages", () => {
    expect(
      mapResponseErrorToMessage(
        new AxiosError("", "400", undefined, null, {
          status: 400,
          data: null,
          statusText: "",
          config: { headers: new AxiosHeaders("") },
          headers: new AxiosHeaders(""),
        })
      )
    ).toEqual("Bad request");

    expect(
      mapResponseErrorToMessage(
        new AxiosError("", "401", undefined, null, {
          status: 401,
          data: null,
          statusText: "",
          config: { headers: new AxiosHeaders("") },
          headers: new AxiosHeaders(""),
        })
      )
    ).toEqual("Unauthenticated");
    expect(
      mapResponseErrorToMessage(
        new AxiosError("", "404", undefined, null, {
          status: 404,
          data: null,
          statusText: "",
          config: { headers: new AxiosHeaders("") },
          headers: new AxiosHeaders(""),
        })
      )
    ).toEqual("Not found");
    expect(
      mapResponseErrorToMessage(
        new AxiosError("", "403", undefined, null, {
          status: 403,
          data: null,
          statusText: "",
          config: { headers: new AxiosHeaders("") },
          headers: new AxiosHeaders(""),
        })
      )
    ).toEqual("Lack of sufficient permissions");
    expect(
      mapResponseErrorToMessage(
        new AxiosError("", "500", undefined, null, {
          status: 500,
          data: null,
          statusText: "",
          config: { headers: new AxiosHeaders("") },
          headers: new AxiosHeaders(""),
        })
      )
    ).toEqual("Internal server error");
    expect(
      mapResponseErrorToMessage(
        new AxiosError("", "0", undefined, null, {
          status: 0,
          data: null,
          statusText: "",
          config: { headers: new AxiosHeaders("") },
          headers: new AxiosHeaders(""),
        })
      )
    ).toEqual("Network error");
  });
});
