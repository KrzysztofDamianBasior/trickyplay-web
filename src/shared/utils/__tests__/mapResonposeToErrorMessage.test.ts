import { mapResponseErrorToMessage } from "../mapResponseErrorToMessage";

describe("mapToResponseErrorMessage returns correct messages", () => {
  it("returns correct messages", () => {
    expect(mapResponseErrorToMessage({ response: { status: 400 } })).toEqual(
      "Bad request"
    );
    expect(mapResponseErrorToMessage({ response: { status: 401 } })).toEqual(
      "Unauthenticated"
    );
    expect(mapResponseErrorToMessage({ response: { status: 404 } })).toEqual(
      "Not found"
    );
    expect(mapResponseErrorToMessage({ response: { status: 403 } })).toEqual(
      "Lack of sufficient permissions"
    );
    expect(mapResponseErrorToMessage({ response: { status: 500 } })).toEqual(
      "Internal server error"
    );
    expect(mapResponseErrorToMessage({ response: { status: 0 } })).toEqual(
      "Request failed"
    );
  });
});
