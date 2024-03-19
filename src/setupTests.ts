// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { server } from "./__tests__/msw/server";
import { resetCommentsCollectionStub } from "./__tests__/msw/stubs/comments";
import { resetRepliesCollectionStub } from "./__tests__/msw/stubs/replies";
import { resetUsersCollectionStub } from "./__tests__/msw/stubs/users";

// Enable request interception.
beforeAll(() => server.listen());

// Reset handlers so that each test could alter them
// without affecting other, unrelated tests.
afterEach(() => {
  resetUsersCollectionStub();
  resetCommentsCollectionStub();
  resetRepliesCollectionStub();
  server.resetHandlers();
});

// Don't forget to clean up afterwards.
afterAll(() => server.close());
