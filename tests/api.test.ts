import request from "supertest";
import { it, expect } from "vitest";
import { createApp } from "../server/index.js";
it("persists check → fix → check → undo with BOM restoration", async () => {
  const app = createApp();
  const base = "/api/sheets/FA-201";
  expect((await request(app).get(base)).status).toBe(200);
  const before = (await request(app).post(`${base}/check`).send({})).body;
  const bom = (await request(app).get(`${base}/bom`)).body;
  const fixed = await request(app).post(`${base}/autofix`).send({});
  expect(fixed.status).toBe(200);
  expect(fixed.body.added.length).toBeGreaterThan(0);
  expect(fixed.body.bomDiff.length).toBeGreaterThan(0);
  expect(
    (await request(app).post(`${base}/check`).send({})).body.summary
      .violationCount,
  ).toBe(0);
  expect((await request(app).post(`${base}/undo`).send({})).status).toBe(200);
  expect((await request(app).post(`${base}/check`).send({})).body).toEqual(
    before,
  );
  expect((await request(app).get(`${base}/bom`)).body).toEqual(bom);
  expect((await request(app).post(`${base}/undo`).send({})).status).toBe(409);
});
it("rejects invalid bodies, unknown sheets and rooms without mutating state", async () => {
  const app = createApp();
  expect(
    (await request(app).post("/api/sheets/FA-201/autofix").send({ roomIds: 7 }))
      .status,
  ).toBe(400);
  expect(
    (
      await request(app)
        .post("/api/sheets/FA-201/autofix")
        .send({ roomIds: ["missing"] })
    ).status,
  ).toBe(400);
  expect(
    (
      await request(app)
        .post("/api/sheets/FA-201/check")
        .send({ unexpected: true })
    ).status,
  ).toBe(400);
  expect((await request(app).get("/api/sheets/missing")).status).toBe(404);
});
it("fixes only the requested room and preserves a useful undo after a no-op", async () => {
  const app = createApp();
  const base = "/api/sheets/FA-201";
  const fixed = (
    await request(app)
      .post(`${base}/autofix`)
      .send({ roomIds: ["storage"] })
  ).body;
  expect(fixed.report.summary.roomsFailing).toBe(4);
  expect(fixed.moved).toHaveLength(1);
  await request(app)
    .post(`${base}/autofix`)
    .send({ roomIds: ["storage"] });
  const undone = (await request(app).post(`${base}/undo`).send({})).body;
  expect(undone.report.summary.roomsFailing).toBe(5);
});
