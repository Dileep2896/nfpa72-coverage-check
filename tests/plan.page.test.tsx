// @vitest-environment jsdom
import { it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { PlanPage } from "../src/pages/PlanPage";
import { sheet, initialDevices, catalog } from "../server/seed/riverside-fa201";
import { checkSheet } from "../shared/check";
import { autoFix } from "../shared/autofix";
import { buildBom, diffBom } from "../shared/bom";
import { api } from "../src/api/client";
vi.mock("../src/api/client", () => ({
  api: { load: vi.fn(), check: vi.fn(), fix: vi.fn(), undo: vi.fn() },
}));
it("reviews, fixes, updates BOM, and undoes the same floor", async () => {
  const user = userEvent.setup();
  let fixed = initialDevices;
  for (const r of sheet.rooms) fixed = autoFix(r, fixed).devices;
  const before = {
    sheet,
    devices: initialDevices,
    report: checkSheet(sheet, initialDevices),
    bom: buildBom(initialDevices, catalog),
    canUndo: false,
  };
  const after = {
    devices: fixed,
    report: checkSheet(sheet, fixed),
    bom: buildBom(fixed, catalog),
    bomDiff: diffBom(before.bom, buildBom(fixed, catalog)),
    added: fixed.filter((d) => d.source === "autofix"),
    moved: [],
    swapped: [],
    canUndo: true,
  };
  vi.mocked(api.load).mockResolvedValue(before);
  vi.mocked(api.fix).mockResolvedValue(after);
  vi.mocked(api.undo).mockResolvedValue({
    ...before,
    added: [],
    moved: [],
    swapped: [],
    bomDiff: [],
  });
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <PlanPage />
    </MemoryRouter>,
  );
  expect(await screen.findByTestId("coverage-score")).toHaveTextContent("87%");
  await user.click(screen.getByRole("button", { name: /Lobby.*coverage/i }));
  expect(screen.getByText(/Farthest gap:/)).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Auto-fix floor" }));
  await waitFor(() =>
    expect(screen.getByTestId("coverage-score")).toHaveTextContent("100%"),
  );
  await user.click(screen.getByRole("tab", { name: /BOM/ }));
  expect(screen.getByTestId("qty-SD-PH-2W")).toHaveTextContent("25");
  await user.click(screen.getByRole("button", { name: "Undo" }));
  await waitFor(() =>
    expect(screen.getByTestId("coverage-score")).toHaveTextContent("87%"),
  );
  expect(screen.getByTestId("qty-SD-PH-2W")).toHaveTextContent("21");
});
