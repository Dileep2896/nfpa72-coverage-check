// @vitest-environment jsdom
import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { StoryPage } from "../src/pages/StoryPage";
it("renders six sections and static stages for reduced motion", () => {
  const { container } = render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <StoryPage />
    </MemoryRouter>,
  );
  expect(
    container.querySelectorAll("section[data-story-section]"),
  ).toHaveLength(6);
  expect(
    screen.getByRole("heading", { name: /checking them still takes hours/i }),
  ).toBeInTheDocument();
  expect(screen.getByTestId("static-stages")).toBeInTheDocument();
  expect(
    screen.getByText("100%", { selector: ".impact-value" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Open FA-201/ })).toHaveAttribute(
    "href",
    "/",
  );
});
