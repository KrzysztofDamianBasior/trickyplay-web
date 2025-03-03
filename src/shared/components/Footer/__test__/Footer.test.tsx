import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";

import Footer from "..";

describe("Footer component", () => {
  it("should render list of links properly", async () => {
    expect.assertions(8);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    // The contentinfo role defines a footer, containing identifying information such as copyright information, navigation links, and privacy statements, found on every document within a site. This section is commonly called a footer.
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();

    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("TrickyPlay");

    const paragraph = screen.getByRole("paragraph");
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent(
      "Application that provides you with simple 2d games"
    );

    const links: HTMLAnchorElement[] = screen.getAllByRole("link");
    expect(links[0].href).toContain(
      "https://www.linkedin.com/in/krzysztof-basior/"
    );
    expect(links[1].href).toContain(
      "https://github.com/KrzysztofDamianBasior/trickyplay-api"
    );
    expect(links[2].href).toContain(
      "https://github.com/KrzysztofDamianBasior/trickyplay-web"
    );

    // screen.getByRole("");
  });
});
