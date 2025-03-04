import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";

import ReplyPresentationThumb from "..";
import { ReplyDetailsType } from "../../../models/internalAppRepresentation/resources";

describe("ReplyPresentationThumb component", () => {
  it("should render reply details properly", async () => {
    expect.assertions(3);

    const replyDetails: ReplyDetailsType = {
      id: "1",
      body: "comment details",
      createdAt: "2025-03-03T12:23:38",
      updatedAt: "2025-03-03T12:53:38",
      author: {
        id: "1",
        createdAt: "2024-05-03T10:27:00",
        updatedAt: "2024-05-03T10:27:00",
        name: "comment author",
        role: "USER",
      },
      parentCommentId: "1",
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <ReplyPresentationThumb replyDetails={replyDetails} />
    );

    const title = screen.getByText(replyDetails.author.name);

    const subheader = screen.getByText(
      `reply created at: ${new Date(
        replyDetails.createdAt
      ).toLocaleString()}, last updated at: ${new Date(
        replyDetails.updatedAt
      ).toLocaleString()}`
    );

    const body = screen.getByText(replyDetails.body);

    expect(title).toBeInTheDocument();
    expect(subheader).toBeInTheDocument();
    expect(body).toBeInTheDocument();
  });
});
