import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";

import CommentPresentationThumb from "..";
import { CommentDetailsType } from "../../../models/internalAppRepresentation/resources";

describe("CommentPresentationThumb component", () => {
  it("should render comment details properly", async () => {
    expect.assertions(3);

    const commentDetails: CommentDetailsType = {
      id: "1",
      body: "comment details",
      createdAt: "2025-03-03T12:23:38",
      updatedAt: "2025-03-03T12:53:38",
      gameName: "Minesweeper",
      author: {
        id: "1",
        createdAt: "2024-05-03T10:27:00",
        updatedAt: "2024-05-03T10:27:00",
        name: "comment author",
        role: "USER",
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <CommentPresentationThumb commentDetails={commentDetails} />
    );
    const title = screen.getByText(commentDetails.author.name);

    const subheader = screen.getByText(
      `comment created at: ${new Date(
        commentDetails.createdAt
      ).toLocaleString()}, last updated at: ${new Date(
        commentDetails.updatedAt
      ).toLocaleString()}`
    );

    const body = screen.getByText(commentDetails.body);

    expect(title).toBeInTheDocument();
    expect(subheader).toBeInTheDocument();
    expect(body).toBeInTheDocument();
  });
});
