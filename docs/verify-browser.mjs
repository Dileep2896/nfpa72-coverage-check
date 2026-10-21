import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
await mkdir(".cache/browser", { recursive: true });
await mkdir(".cache/tmp", { recursive: true });
const browser = await chromium.launchPersistentContext(
  path.resolve(".cache/browser"),
  {
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
    env: { ...process.env, TMPDIR: path.resolve(".cache/tmp") },
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
    args: ["--disable-background-networking", "--no-first-run"],
  },
);
const page = browser.pages()[0];
page.setDefaultTimeout(10000);
const errors = [],
  external = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("request", (r) => {
  if (
    !/^https?:\/\/(127\.0\.0\.1|localhost)(:|\/)/.test(r.url()) &&
    !r.url().startsWith("data:")
  )
    external.push(r.url());
});
const base = process.env.VERIFY_URL ?? "http://127.0.0.1:4000";
await page.goto(base);
await page.getByTestId("coverage-score").waitFor();
assert.match(await page.getByTestId("coverage-score").innerText(), /87%/);
await page.screenshot({ path: "docs/plan.png", fullPage: true });
console.log("Initial plan rendered");
await page.getByRole("button", { name: /Lobby.*coverage/ }).click();
await page.getByText(/Farthest gap:/).waitFor();
console.log("Room violation shown");
await page.getByRole("button", { name: "Auto-fix room", exact: true }).click();
await page.getByText("This room passes all configured checks.").waitFor();
await page.getByRole("button", { name: "Undo", exact: true }).click();
await page.getByText(/Farthest gap:/).waitFor();
console.log("Room violation shown");
await page.keyboard.press("Escape");
await page.getByRole("button", { name: "Auto-fix floor", exact: true }).click();
await page.getByText("All rooms pass.", { exact: true }).waitFor();
assert.equal(await page.getByTestId("coverage-score").innerText(), "100%");
await page.getByRole("tab", { name: "BOM" }).click();
assert.match(await page.getByTestId("qty-SD-PH-2W").innerText(), /25/);
await page.screenshot({ path: "docs/plan-fixed.png", fullPage: true });
await page.getByRole("button", { name: "Undo", exact: true }).click();
await page.getByTestId("coverage-score").filter({ hasText: "87%" }).waitFor();
assert.match(await page.getByTestId("qty-SD-PH-2W").innerText(), /21/);
const responsive = [];
for (const route of ["/", "/story"]) {
  await page.goto(base + route);
  await page.getByRole("heading", { level: 1 }).waitFor();
  if (route === "/") await page.getByTestId("coverage-score").waitFor();
  for (const width of [320, 375, 414, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    const sizes = await page.evaluate(() => ({
      viewport: innerWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }));
    responsive.push({ route, width, ...sizes });
    assert.ok(
      sizes.document <= width,
      `${route} overflow at ${width}: ${JSON.stringify(sizes)}`,
    );
    if (width === 375)
      await page.screenshot({
        path: route === "/" ? "docs/plan-mobile.png" : "docs/story-mobile.png",
        fullPage: true,
      });
  }
}
await page.setViewportSize({ width: 1440, height: 1000 });
await page.screenshot({ path: "docs/story.png", fullPage: true });
await page.emulateMedia({ reducedMotion: "no-preference" });
await page.goto(base + "/story");
await page.getByRole("heading", { level: 1 }).waitFor();
await page.waitForTimeout(1700);
await page.screenshot({ path: "docs/story-hero.png", fullPage: false });
for (const ratio of [0, 0.25, 0.5, 0.7, 0.95]) {
  await page.evaluate((r) => {
    const s = document.querySelector('[data-story-section="diagram"]');
    window.scrollTo(0, s.getBoundingClientRect().top + scrollY + 2200 * r);
  }, ratio);
  await page.waitForTimeout(450);
  const expected = Math.min(4, Math.floor(ratio * 5));
  await page.locator(`.story-diagram.stage-${expected}`).waitFor();
  await page.screenshot({
    path: `docs/story-stage-${expected}.png`,
    fullPage: false,
  });
}
await page
  .getByRole("heading", { name: /Less guesswork/ })
  .scrollIntoViewIfNeeded();
await page.waitForTimeout(700);
await page.screenshot({ path: "docs/story-impact.png", fullPage: false });
assert.equal(await page.locator("section[data-story-section]").count(), 6);
assert.deepEqual(errors, []);
assert.deepEqual(external, []);
await writeFile(
  "docs/browser-results.json",
  JSON.stringify(
    {
      errors,
      external,
      responsive,
      flows: [
        "room fix + undo",
        "floor fix + BOM + undo",
        "story scroll choreography",
        "reduced-motion static stages",
      ],
    },
    null,
    2,
  ),
);
console.log(
  JSON.stringify({
    result: "PASS",
    viewports: responsive.length,
    consoleErrors: errors.length,
    externalRequests: external.length,
  }),
);
await browser.close();
